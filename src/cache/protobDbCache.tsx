import localforage from 'localforage'
import ProtonDBTier from '../../types/ProtonDBTier'

const STORAGE_KEY = 'protondb-badges-cache'

localforage.config({
  name: STORAGE_KEY
})

type ProtonDBCache = {
  tier: ProtonDBTier
  linuxSupport: boolean
  lastUpdated: string
}

export async function updateCache(appId: string, newData: ProtonDBCache) {
  const oldCache = await localforage.getItem<ProtonDBCache>(appId)
  const newCache: ProtonDBCache = { ...oldCache, ...newData }
  await localforage.setItem(appId, newCache)
  return newCache
}

export function clearCache(appId?: string) {
  if (appId?.length) {
    localforage.removeItem(appId)
  } else {
    localStorage.removeItem(STORAGE_KEY)
    localforage.clear()
  }
}

export async function getCache(appId: string): Promise<ProtonDBCache | null> {
  const data = await localforage.getItem<ProtonDBCache>(appId)
  return data
}
