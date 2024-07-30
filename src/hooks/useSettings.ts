import { call } from '@decky/api'
import { useEffect, useState } from 'react'

export type Settings = {
  size: 'regular' | 'small' | 'minimalist'
  position: 'tl' | 'tr' | 'bl' | 'br'
  labelTypeOnHover: 'off' | 'small' | 'regular'
}

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>({
    size: 'regular',
    position: 'tl',
    labelTypeOnHover: 'off'
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getData = async () => {
      const savedSettings = await call<[string, Settings], Settings>('get_setting', 'settings', settings)
      setSettings(savedSettings)
      setLoading(false)
    }
    getData()
  }, [])

  async function updateSettings(
    key: keyof Settings,
    value: Settings[keyof Settings]
  ) {
    setSettings((oldSettings) => {
      const newSettings = { ...oldSettings, [key]: value }
      call<[string, Settings], Settings>('set_setting', 'settings', newSettings).catch(console.error)
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

  return { settings, setSize, setPosition, setLabelOnHover, loading }
}
