import { definePlugin, ServerAPI, staticClasses } from 'decky-frontend-lib'
import { FaReact } from 'react-icons/fa'

import Settings from './components/settings'
import { ProtonDBCacheProvider } from './context/protobDbCacheContext'
import { SettingsProvider } from './context/settingsContext'
import patchHome from './lib/patchHome'
import patchLibraryApp from './lib/patchLibraryApp'

export default definePlugin((serverAPI: ServerAPI) => {
  const libraryPatch = patchLibraryApp(serverAPI)
  const homePatch = patchHome(serverAPI)
  return {
    title: <div className={staticClasses.Title}>ProtonDB Badges</div>,
    icon: <FaReact />,
    content: (
      <ProtonDBCacheProvider>
        <SettingsProvider>
          <Settings />
        </SettingsProvider>
      </ProtonDBCacheProvider>
    ),
    onDismount() {
      serverAPI.routerHook.removePatch('/library/app/:appid', libraryPatch)
      serverAPI.routerHook.removePatch('/library/home', homePatch)
    }
  }
})
