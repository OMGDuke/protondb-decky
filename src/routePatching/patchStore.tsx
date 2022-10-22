import { findModuleChild, ServerAPI } from 'decky-frontend-lib'

const History = findModuleChild((m) => {
  if (typeof m !== 'object') return undefined
  for (const prop in m) {
    if (m[prop]?.m_history) return m[prop].m_history
  }
})

function generateBadge(tab: any) {
  const code = `console.log('IN THE TAB ${tab.title}');`
  return code
}

export function patchStore(serverApi: ServerAPI): () => void {
  const unlisten = History.listen(
    async (info: {
      hash: string
      key: string
      pathname: string
      search: string
      state: { force: number; url: string }
    }) => {
      if (info.pathname === '/steamweb') {
        const response = await serverApi.fetchNoCors<{ body: string }>(
          'http://localhost:8080/json'
        )
        let tabs: Array<any> = []
        if (response.success) tabs = JSON.parse(response.result.body)
        const tab = tabs.find((t) =>
          t.url.includes('https://store.steampowered.com/app/')
        )

        if (tab && tab.title) {
          alert(tab.title)
          const socket = new WebSocket(tab.webSocketDebuggerUrl)

          const result: any = await serverApi.executeInTab(
            tab.title,
            true,
            generateBadge(tab)
          )
        }
      }
    }
  )
  return unlisten
}
