import React from 'react'
import { definePlugin, ServerAPI, staticClasses } from 'decky-frontend-lib'
import { FaReact } from 'react-icons/fa'

import Settings from './components/settings'
import patchLibraryApp from './lib/patchLibraryApp'

export default definePlugin((serverAPI: ServerAPI) => {
  const libraryPatch = patchLibraryApp(serverAPI)
  return {
    title: <div className={staticClasses.Title}>ProtonDB Badges</div>,
    icon: <FaReact />,
    content: <Settings serverAPI={serverAPI} />,
    onDismount() {
      serverAPI.routerHook.removePatch('/library/app/:appid', libraryPatch)
    }
  }
})
