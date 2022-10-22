import { ServerAPI } from 'decky-frontend-lib'
import puppeteer from 'puppeteer-core'

// This is needed due to CORS, everything after is over WS which doesn't care/through puppeteer
async function getDevtoolsInfo(serverApi: ServerAPI): Promise<any | undefined> {
  const req = {
    method: 'GET',
    url: 'http://localhost:8081/json/version'
  }
  return await serverApi
    .callServerMethod<typeof req, { body: string; status: number }>(
      'http_request',
      req
    )
    .then((response) => {
      if (response.success && response.result.status === 200) {
        return JSON.parse(response.result?.body)
      }
      throw response.result
    })
    .catch((e) => {
      console.error('Error fetching browser CDP endpoint', e)
      return undefined
    })
}

export async function getStorePage(serverApi: ServerAPI) {
  console.log('GET STORE PAGE')
  /*
    Blocks are equivalent raw calls
    */
  // Can we skip the fetch and just use URL? Yes but it would hit CORS in `puppeteer.connect`
  const info = await getDevtoolsInfo(serverApi)
  console.log('info', info)
  if (!info) return
  // Essentially just opening a websocket to the browser (not page) endpoint
  /*
    const browser = new WebSocket(info.webSocketDebuggerUrl)
    */
  const browser = await puppeteer.connect({
    browserWSEndpoint: info.webSocketDebuggerUrl
  })
  console.log('browser', browser)
  // Puppeteer also handles ID management for messages so that's nice
  /*
    let id = 0;
    let targets;
    browser.onMessage = (e) => {targets = JSON.parse(e.data); } // Should also check IDs and stuff
    browser.send(JSON.stringify(id:++id;method:"Target.getTargets"))
    // Don't do this until onMessage comes back
    // Clear onMessage
    // The target info is a nice blob of stuff like {"id":2,"result":{"targetInfos":[{"targetId":"1927902778B96AC57CFF7CEF993B7EC6","type":"page","title":"Toast","url":"about:blank?browserviewpopup=1&requestid=34","attached":false,"openerId":"B958E0710A814363EB8F93D65006B563","browserContextId":"6159036563620C177B83C46D1C93DB67"},{"targetId":"31A8DEE3F898D8078D42B50A5D621A72","type":"page","title":"Welcome to Steam","url":"https://store.steampowered.com/","attached":false,"browserContextId":"6159036563620C177B83C46D1C93DB67"},{"targetId":"5A5EADD59FE24F75587E51A51CCF8786","type":"page","title":"data:text/html,<body><%2Fbody>","url":"data:text/html,%3Cbody%3E%3C%2Fbody%3E","attached":false,"browserContextId":"6159036563620C177B83C46D1C93DB67"},{"targetId":"081E120C339695CC4A0AB946FDE00187","type":"page","title":"QuickAccess","url":"about:blank?browserviewpopup=1&requestid=6","attached":false,"openerId":"B958E0710A814363EB8F93D65006B563","browserContextId":"6159036563620C177B83C46D1C93DB67"},{"targetId":"C82831771072BB9E6474C7417CCFCC6E","type":"page","title":"data:text/html,<body><%2Fbody>","url":"data:text/html,%3Cbody%3E%3C%2Fbody%3E","attached":false,"browserContextId":"6159036563620C177B83C46D1C93DB67"},{"targetId":"1980C625AAAD1D1CBC9E7E8F73F95234","type":"page","title":"MainMenu","url":"about:blank?browserviewpopup=1&requestid=2","attached":false,"openerId":"B958E0710A814363EB8F93D65006B563","browserContextId":"6159036563620C177B83C46D1C93DB67"},{"targetId":"B958E0710A814363EB8F93D65006B563","type":"page","title":"SP","url":"https://steamloopback.host/routes/steamweb","attached":false,"browserContextId":"6159036563620C177B83C46D1C93DB67"}]}}
    // So you can filter on any of the parts
    let target = targets.find((target) => target.url.includes('store.steampowered.com/'))
    if (!target) {
    browser.onMessage = (e) => {
    const info = JSON.parse(e.data);
    if (info.method === 'Target.targetCreated' && info.params.targetInfo.url.includes('store.steampowered.com/')) {
    target = info.params.targetInfo;
    // unset onMessage
    }
    }
    }
    */
  const storePageTarget = await browser.waitForTarget((target) =>
    target.url().includes('store.steampowered.com/')
  )
  console.log('storePageTarget', storePageTarget)
  // Basically just typing so we're dealing with the Page not the Target endpoint for typescript
  /*
    let sessionId;
    // Do this better, this is just the lazy pseudocode
    browser.onMessage = (e) => {sessionId = JSON.parse(e.data).result.sessionId;clearonMessage}
    browser.send(JSON.stringify({id:++id,method:"Target.attachToTarget",params:{targetId:target.targetId,flatten:true}}));
    */
  const storePage = await storePageTarget.page()
  console.log('storePage', storePage)
  // Set a script/function to evaluate on any page navigation/frame load
  /*
    // Every interaction with the page from here on should use the sessionId or it'll be sent to the browser instead
    // You could alternatively open a ws connection to the page via its id/websocket url
    browser.send(JSON.stringify({sessionId,id:++id,method:"Page.addScriptToEvaluateOnNewDocument",params:{source:"thescripttoexecute"}}));
    // Since this will execute BEFORE anything on the page--it's super likely it's loaded before even the DOM, so
    // directly inserting dom nodes just will fail (silently, woo)
    // So put whatever you want in a function, and use the document.readyState/DOMContentLoaded paradigm below as your entry point
    */
  await storePage?.evaluateOnNewDocument(() => {
    function addTestDivToBodyStart() {
      const div = document.createElement('div')
      div.innerText = 'test'
      document.body.prepend(div)
    }
    if (document.readyState === 'loading') {
      addEventListener('DOMContentLoaded', () => {
        addTestDivToBodyStart()
      })
    } else {
      console.log('HELLO THERE')
      addTestDivToBodyStart()
    }
  })
}
