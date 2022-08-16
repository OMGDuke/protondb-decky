import * as React from 'react'

type Action = { type: 'set-minimalist'; value: boolean }
type Dispatch = (action: Action) => void
type State = { minimalist: boolean }
type SettingsProviderProps = { children: React.ReactNode }

const SettingsStateContext = React.createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined)

function settingsReducer(state: State, action: Action) {
  switch (action.type) {
    case 'set-minimalist': {
      return { ...state, minimalist: action.value }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function SettingsProvider({ children }: SettingsProviderProps) {
  const [state, dispatch] = React.useReducer(settingsReducer, {
    minimalist: false
  })
  React.useEffect(() => {
    async function getSettings() {
      SteamClient.Storage.GetJSON('protondb-badges-settings').then((result) => {
        dispatch({
          type: 'set-minimalist',
          value: JSON.parse(result).minimalist || false
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
