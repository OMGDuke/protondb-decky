import * as React from 'react'
import ProtonDBTier from '../../types/ProtonDBTier'

const LOCAL_STORAGE_KEY = 'protondb-badges-cache'

type State = {
  [appId: string]: {
    tier: ProtonDBTier
    linuxSupport: boolean
    lastUpdated: string
  }
}

type Action =
  | {
      type: 'update-cache'
      value: {
        appId: string
        data: {
          tier: ProtonDBTier
          linuxSupport: boolean
          lastUpdated: string
        }
      }
    }
  | { type: 'load-cache'; value: State }
  | { type: 'clear-cache' }

export type ProtonDBCacheDispatch = (action: Action) => void

type ProtonDBCacheProviderProps = { children: React.ReactNode }

const ProtonDBCacheStateContext = React.createContext<
  | { state: State; dispatch: ProtonDBCacheDispatch; loading: boolean }
  | undefined
>(undefined)

const defaultCache: State = {} as const

function protonDBCacheReducer(state: State, action: Action) {
  switch (action.type) {
    case 'load-cache': {
      return action.value
    }
    case 'update-cache': {
      const oldCache = state[action.value.appId] || {}
      const newCache = {
        ...state,
        [action.value.appId]: { ...oldCache, ...action.value.data }
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newCache))
      return newCache
    }
    case 'clear-cache': {
      localStorage.removeItem(LOCAL_STORAGE_KEY)
      return defaultCache
    }
  }
}

function ProtonDBCacheProvider({ children }: ProtonDBCacheProviderProps) {
  const [state, dispatch] = React.useReducer(protonDBCacheReducer, defaultCache)
  const [loading, setLoading] = React.useState(true)
  React.useEffect(() => {
    async function getCache() {
      const cacheString = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (!cacheString) {
        dispatch({
          type: 'load-cache',
          value: defaultCache
        })
        return setLoading(false)
      }
      const currentCache: State = JSON.parse(cacheString)
      await dispatch({
        type: 'load-cache',
        value: currentCache
      })
      setLoading(false)
    }
    getCache()
  }, [])
  const value = { state, dispatch, loading }
  return (
    <ProtonDBCacheStateContext.Provider value={value}>
      {children}
    </ProtonDBCacheStateContext.Provider>
  )
}

function useProtonDBCache() {
  const context = React.useContext(ProtonDBCacheStateContext)
  if (context === undefined) {
    throw new Error(
      'useProtonDBCache must be used within a ProtonDBCacheProvider'
    )
  }
  return context
}

export { ProtonDBCacheProvider, useProtonDBCache }
