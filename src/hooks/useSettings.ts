import { call } from '@decky/api'
import { useEffect, useState } from 'react'
import { BehaviorSubject } from 'rxjs'

export type Settings = {
  size: 'regular' | 'small' | 'minimalist'
  position: 'tl' | 'tr' | 'bl' | 'br'
  labelTypeOnHover: 'off' | 'small' | 'regular'
}

// Not using the React context here as this approach is simpler.
const SettingsContext = new BehaviorSubject<Settings>({
  size: 'regular',
  position: 'tl',
  labelTypeOnHover: 'off'
})
const LoadingContext = new BehaviorSubject(true)

function updateSettings(
  key: keyof Settings,
  value: Settings[keyof Settings]
) {
  const newSettings = { ...SettingsContext.value, [key]: value }
  call<[string, Settings], Settings>('set_setting', 'settings', newSettings).catch(console.error)
  SettingsContext.next(newSettings)
}

export function loadSettings() {
  LoadingContext.next(true)
  call<[string, Settings], Settings>('get_setting', 'settings', SettingsContext.value)
    .then(settings => SettingsContext.next(settings))
    .catch(console.error)
    .finally(() => LoadingContext.next(false))
}

export const useSettings = () => {
  const [settings, setSettings] = useState(SettingsContext.value)
  const [loading, setLoading] = useState(LoadingContext.value)

  useEffect(() => {
    const settingsSub = SettingsContext.asObservable().subscribe((value) => setSettings(value));
    const loadingSub = LoadingContext.asObservable().subscribe((value) => setLoading(value));
    return () => {
      loadingSub.unsubscribe();
      settingsSub.unsubscribe();
    };
  }, []);

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
