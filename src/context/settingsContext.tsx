import * as React from 'react'
type State = {
  size: 'regular' | 'small' | 'minimalist'
  position: 'tl' | 'tr' | 'bl' | 'br'
}

type Action =
  | { type: 'set-size'; value: State['size'] }
  | { type: 'set-position'; value: State['position'] }
  | { type: 'set-settings'; value: State }
type Dispatch = (action: Action) => void

type SettingsProviderProps = { children: React.ReactNode }

const SettingsStateContext = React.createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined)

const defaultSettings = { size: 'regular', position: 'tl' } as const

function settingsReducer(state: State, action: Action) {
  switch (action.type) {
    case 'set-size': {
      return { ...state, size: action.value }
    }
    case 'set-position': {
      return { ...state, position: action.value }
    }
    case 'set-settings': {
      return action.value
    }
  }
}

function SettingsProvider({ children }: SettingsProviderProps) {
  const [state, dispatch] = React.useReducer(settingsReducer, defaultSettings)
  React.useEffect(() => {
    async function getSettings() {
      SteamClient.Storage.GetJSON('protondb-badges-settings')
        .then((result) => {
          const storedSettings = JSON.parse(result)
          dispatch({
            type: 'set-settings',
            value: {
              size: storedSettings?.size || defaultSettings.size,
              position: storedSettings.position || defaultSettings.position
            }
          })
        })
        .catch((e) => {
          dispatch({
            type: 'set-settings',
            value: defaultSettings
          })
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
