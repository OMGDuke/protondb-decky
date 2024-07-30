import React from 'react'
import { definePlugin, staticClasses } from '@decky/ui'
import { routerHook } from '@decky/api'
import { FaReact } from 'react-icons/fa'

import Settings from './components/settings'
import patchLibraryApp from './lib/patchLibraryApp'

export default definePlugin(() => {
  const libraryPatch = patchLibraryApp()
  return {
    title: <div className={staticClasses.Title}>ProtonDB Badges</div>,
    icon: <FaReact />,
    content: <Settings />,
    onDismount() {
      routerHook.removePatch('/library/app/:appid', libraryPatch)
    }
  }
})
