import { definePlugin, ServerAPI, staticClasses } from 'decky-frontend-lib'
import { SiProtondb } from 'react-icons/si'
import patchLibraryApp from './lib/patchLibraryApp'

export default definePlugin((serverAPI: ServerAPI) => {
  const libraryPatch = patchLibraryApp(serverAPI)
  return {
    title: <div className={staticClasses.Title}>ProtonDB Badges</div>,
    icon: <SiProtondb />,
    onDismount() {
      serverAPI.routerHook.removePatch('/library/app/:appid', libraryPatch)
    }
  }
})
