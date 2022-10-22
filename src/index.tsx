import { definePlugin, ServerAPI, staticClasses } from 'decky-frontend-lib'
import { FaReact } from 'react-icons/fa'

import Settings from './components/settings'
import { SettingsProvider } from './context/settingsContext'
import { getStorePage } from './lib/storeInjection'
import patchLibraryApp from './routePatching/patchLibraryApp'
import { patchStore } from './routePatching/patchStore'

export default definePlugin((serverAPI: ServerAPI) => {
  const unpatchLibrary = patchLibraryApp(serverAPI)
  // const unpatchStore = patchStore(serverAPI)
  getStorePage(serverAPI)

  return {
    title: <div className={staticClasses.Title}>ProtonDB Badges</div>,
    icon: <FaReact />,
    content: (
      <SettingsProvider>
        <Settings />
      </SettingsProvider>
    ),
    onDismount() {
      unpatchLibrary()
      // unpatchStore()
    }
  }
})
