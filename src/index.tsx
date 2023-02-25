import { definePlugin, ServerAPI, staticClasses } from 'decky-frontend-lib'
import { FaReact } from 'react-icons/fa'

import Settings from './components/settings'
import { SettingsProvider } from './context/settingsContext'
import useTranslations from './hooks/useTranslations'
import patchLibraryApp from './lib/patchLibraryApp'

export default definePlugin((serverAPI: ServerAPI) => {
  const t = useTranslations()
  const libraryPatch = patchLibraryApp(serverAPI)
  return {
    title: <div className={staticClasses.Title}>{t('pluginName')}</div>,
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
