import { definePlugin, ServerAPI, staticClasses } from 'decky-frontend-lib'
import { FaReact } from 'react-icons/fa'

import Settings from './components/settings'
import { SettingsProvider } from './context/settingsContext'
import patchLibrary from './lib/patchLibrary'
import patchLibraryApp from './lib/patchLibraryApp'

export default definePlugin((serverAPI: ServerAPI) => {
  const libraryAppPatch = patchLibraryApp(serverAPI)
  const libraryPatch = patchLibrary(serverAPI)
  return {
    title: <div className={staticClasses.Title}>ProtonDB Badges</div>,
    icon: <FaReact />,
    content: (
      <SettingsProvider>
        <Settings />
      </SettingsProvider>
    ),
    onDismount() {
      serverAPI.routerHook.removePatch('/library/app/:appid', libraryAppPatch)
      serverAPI.routerHook.removePatch('/library', libraryPatch)
    }
  }
})
