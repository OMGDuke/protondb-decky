import { definePlugin, ServerAPI, staticClasses } from 'decky-frontend-lib'
import { FaReact } from 'react-icons/fa'

import Settings from './components/settings'
import { SettingsProvider } from './context/settingsContext'
import patchLibraryApp from './lib/patchLibraryApp'

export default definePlugin((serverAPI: ServerAPI) => {
  const libraryPatch = patchLibraryApp(serverAPI)
  return {
    title: <div className={staticClasses.Title}>ProtonDB Badges</div>,
    icon: <FaReact />,
    content: (
      <SettingsProvider>
        <Settings />
      </SettingsProvider>
    ),
    onDismount() {
      serverAPI.routerHook.removePatch('/library/app/:appid', libraryPatch)
    }
  }
})
