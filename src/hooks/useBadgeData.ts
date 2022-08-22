import { ServerAPI } from 'decky-frontend-lib'
import { useEffect, useState } from 'react'

import ProtonDBTier from '../../types/ProtonDBTier'
import { getLinuxInfo, getProtonDBInfo } from '../actions/protondb'
import { useProtonDBCache } from '../context/protobDbCacheContext'
import { isOutdated } from '../lib/time'

const useBadgeData = (serverAPI: ServerAPI, appId: string | undefined) => {
  const {
    state: cacheState,
    dispatch: cacheDispatch,
    loading: cacheLoading
  } = useProtonDBCache()
  const [protonDBTier, setProtonDBTier] = useState<ProtonDBTier>()
  const [linuxSupport, setLinuxSupport] = useState<boolean>(false)

  async function refresh() {
    const tierPromise = getProtonDBInfo(serverAPI, appId as string).catch(
      () => 'pending' as const
    )
    const linuxPromise = getLinuxInfo(serverAPI, appId as string).catch(
      () => false
    )
    const [tier, linuxSupport] = await Promise.all([tierPromise, linuxPromise])
    cacheDispatch({
      type: 'update-cache',
      value: {
        appId: appId as string,
        data: {
          tier: tier,
          linuxSupport,
          lastUpdated: new Date().toISOString()
        }
      }
    })
    setProtonDBTier(tier)
  }

  useEffect(() => {
    // Proton DB Data
    let ignore = false
    async function getData() {
      if (cacheState?.[appId as string]?.tier) {
        setProtonDBTier(cacheState?.[appId as string].tier)
        if (!isOutdated(cacheState?.[appId as string]?.lastUpdated)) return
      }
      const tier = await getProtonDBInfo(serverAPI, appId as string)
      if (ignore) {
        return
      }
      setProtonDBTier(tier)
    }
    if (appId?.length && !cacheLoading) {
      getData()
    }
    return () => {
      ignore = true
    }
  }, [appId, cacheLoading])

  useEffect(() => {
    // Linux Data
    let ignore = false
    async function getData() {
      if (cacheState?.[appId as string]?.linuxSupport !== undefined) {
        setLinuxSupport(cacheState?.[appId as string]?.linuxSupport)
        if (!isOutdated(cacheState?.[appId as string]?.lastUpdated)) return
      }
      const linuxSupport = await getLinuxInfo(serverAPI, appId as string)
      if (ignore) {
        return
      }
      setLinuxSupport(linuxSupport)
    }

    if (appId?.length) {
      getData()
    }
    return () => {
      ignore = true
    }
  }, [appId])

  useEffect(() => {
    if (protonDBTier) {
      cacheDispatch({
        type: 'update-cache',
        value: {
          appId: appId as string,
          data: {
            tier: protonDBTier,
            linuxSupport,
            lastUpdated: new Date().toISOString()
          }
        }
      })
    }
  }, [protonDBTier, linuxSupport])

  return { protonDBTier: protonDBTier, linuxSupport, refresh }
}

export default useBadgeData
