import {
  definePlugin,
  ReactRouter,
  ServerAPI,
  staticClasses
} from 'decky-frontend-lib'
import { FaReact } from 'react-icons/fa'

import Settings from './components/settings'
import { ProtonDBCacheProvider } from './context/protobDbCacheContext'
import { SettingsProvider } from './context/settingsContext'
import patchHome from './lib/patchHome'
import patchLibrary from './lib/patchLibrary'
import patchLibraryApp from './lib/patchLibraryApp'

export default definePlugin((serverAPI: ServerAPI) => {
  const libraryAppPatch = patchLibraryApp(serverAPI)
  // const homePatch = patchHome(serverAPI)
  const libraryPatch = patchLibrary(serverAPI)
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
      serverAPI.routerHook.removePatch('/library/app/:appid', libraryAppPatch)
      serverAPI.routerHook.removePatch('/library/tab/Installed', libraryPatch)
      // serverAPI.routerHook.removePatch('/library/home', homePatch)
    }
  }
})
