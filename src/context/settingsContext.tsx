import * as React from 'react'

const LOCAL_STORAGE_KEY = 'protondb-badges-settings'
type State = {
  size: 'regular' | 'small' | 'minimalist'
  position: 'tl' | 'tr' | 'bl' | 'br'
}

type Action =
  | { type: 'set-size'; value: State['size'] }
  | { type: 'set-position'; value: State['position'] }
  | { type: 'load-settings'; value: State }
type Dispatch = (action: Action) => void

type SettingsProviderProps = { children: React.ReactNode }

const SettingsStateContext = React.createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined)

const defaultSettings = { size: 'regular', position: 'tl' } as const

function settingsReducer(state: State, action: Action) {
  switch (action.type) {
    case 'set-size': {
      const newState = { ...state, size: action.value }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState))
      return newState
    }
    case 'set-position': {
      const newState = { ...state, position: action.value }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState))
      return newState
    }
    case 'load-settings': {
      return action.value
    }
  }
}

function SettingsProvider({ children }: SettingsProviderProps) {
  const [state, dispatch] = React.useReducer(settingsReducer, defaultSettings)
  React.useEffect(() => {
    async function getSettings() {
      const settingsString = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (!settingsString) {
        dispatch({
          type: 'load-settings',
          value: defaultSettings
        })
        return
      }
      const storedSettings = JSON.parse(settingsString)
      dispatch({
        type: 'load-settings',
        value: {
          size: storedSettings?.size || defaultSettings.size,
          position: storedSettings.position || defaultSettings.position
        }
      })
    }
    getSettings()
  }, [])
  const value = { state, dispatch }
  return (
    <SettingsStateContext.Provider value={value}>
      {children}
    </SettingsStateContext.Provider>
  )
}

function useSettings() {
  const context = React.useContext(SettingsStateContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

export { SettingsProvider, useSettings }
