import { findModuleChild, ServerAPI } from 'decky-frontend-lib'
import { getProtonDBInfo } from '../actions/protondb'
import ProtonDBTier from '../../types/ProtonDBTier'
import { medalColours } from '../lib/constants'

type Tab = {
  description: string
  devtoolsFrontendUrl: string
  id: string
  title: string
  type: 'page'
  url: string
  webSocketDebuggerUrl: string
}

type Info = {
  hash: string
  key: string
  pathname: string
  search: string
  state: { force: number; url: string }
}

const History: {
  listen: (callback: (info: Info) => Promise<void>) => () => void
} = findModuleChild((m) => {
  if (typeof m !== 'object') return undefined
  for (const prop in m) {
    if (m[prop]?.m_history) return m[prop].m_history
  }
})

function injectIntoStore(
  tab: Tab,
  appId: string,
  protonDBTier: ProtonDBTier | undefined
) {
  let code = ''
  if (protonDBTier) {
    code = `
  try{
    window.onload = () => {
      let targetClass = document.querySelector('[class^="deckverified_BannerContent"]')?.className;
      const badgeContainer = document.createElement("a");
      badgeContainer.href = "https://www.protondb.com/app/${appId}"
      badgeContainer.style.cssText = 'background:${
        medalColours[protonDBTier].background
      };color:${
      medalColours[protonDBTier].text
    };padding:10px;margin-top:5px;display:flex;flex-direction:row;align-items:center;'
      var img = document.createElement('img');
      img.src = "https://www.protondb.com/sites/protondb/images/site-logo.svg"
      img.height = "30"
      img.width = "30"
      img.alt = "ProtonDB Logo"
      img.style.cssText = "margin-right: 5px;"
      badgeContainer.appendChild(img)
      const badgeContent = document.createTextNode("${protonDBTier?.toUpperCase()}");
      badgeContainer.appendChild(badgeContent);
      const targetDiv = document.getElementsByClassName(targetClass)?.[0];
      if (targetDiv?.parentNode) {
        targetDiv?.parentNode?.insertBefore(badgeContainer, targetDiv.nextSibling);
      }
    }
  } catch(err) {
    console.log('err', err);
  }
  `
  }
  return code
}

export function patchStore(serverApi: ServerAPI): () => void {
  const unlisten = History.listen(async (info) => {
    try {
      if (info.pathname === '/steamweb') {
        const response = await serverApi.fetchNoCors<{ body: string }>(
          'http://localhost:8080/json'
        )
        let tabs: Tab[] = []
        if (response.success) tabs = JSON.parse(response.result.body) || []
        const tab = tabs.find((t) =>
          t.url.includes('https://store.steampowered.com/app/')
        )
        if (tab?.title) {
          const appId = tab.url.match(/\/app\/([\d]+)\/?/)?.[1]
          if (appId) {
            const tier = await getProtonDBInfo(serverApi, appId as string)
            serverApi.executeInTab(
              tab.title,
              true,
              injectIntoStore(tab, appId, tier)
            )
          }
        }
      }
    } catch (err) {
      console.log(err)
    }
  })
  return unlisten
}
