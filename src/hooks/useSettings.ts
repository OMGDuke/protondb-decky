import { useEffect, useState } from 'react'

import { ServerAPI } from 'decky-frontend-lib'

export type Settings = {
  size: 'regular' | 'small' | 'minimalist'
  position: 'tl' | 'tr' | 'bl' | 'br'
  labelTypeOnHover: 'off' | 'small' | 'regular'
}

export const useSettings = (serverApi: ServerAPI) => {
  const [settings, setSettings] = useState<Settings>({
    size: 'regular',
    position: 'tl',
    labelTypeOnHover: 'off'
  })

  useEffect(() => {
    const getData = async () => {
      const savedSettings = (
        await serverApi.callPluginMethod('get_settings', {
          key: 'settings',
          default: settings
        })
      ).result as Settings
      setSettings(savedSettings)
    }
    getData()
  }, [])

  async function updateSettings(
    key: keyof Settings,
    value: Settings[keyof Settings]
  ) {
    setSettings((oldSettings) => {
      const newSettings = { ...oldSettings, [key]: value }
      serverApi.callPluginMethod('set_setting', {
        key: 'settings',
        value: newSettings
      })
      return newSettings
    })
  }

  function setSize(value: Settings['size']) {
    updateSettings('size', value)
  }

  function setPosition(value: Settings['position']) {
    updateSettings('position', value)
  }

  function setLabelOnHover(value: Settings['labelTypeOnHover']) {
    updateSettings('labelTypeOnHover', value)
  }

  return { settings, setSize, setPosition, setLabelOnHover }
}
