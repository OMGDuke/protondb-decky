import { ServerAPI } from 'decky-frontend-lib'
import { useEffect, useState } from 'react'
import BadgeStyle from '../../types/BadgeStyle'
import ProtonDBTier from '../../types/ProtonDBTier'
import { getLinuxInfo, getProtonDBInfo } from '../actions/protondb'
import { useProtonDBCache } from '../context/protobDbCacheContext'
import { isOutdated } from '../lib/time'

const tiers: { [tier: string]: BadgeStyle } = {
  pending: {
    key: 'pending',
    label: 'PENDING',
    backgroundColor: 'rgb(68, 68, 68)',
    textColor: 'white'
  },
  borked: {
    key: 'borked',
    label: 'BORKED',
    backgroundColor: 'red',
    textColor: 'black'
  },
  bronze: {
    key: 'bronze',
    label: 'BRONZE',
    backgroundColor: 'rgb(205, 127, 50)',
    textColor: 'black'
  },
  silver: {
    key: 'silver',
    label: 'SILVER',
    backgroundColor: 'rgb(166, 166, 166)',
    textColor: 'black'
  },
  gold: {
    key: 'gold',
    label: 'GOLD',
    backgroundColor: 'rgb(207, 181, 59)',
    textColor: 'black'
  },
  platinum: {
    key: 'platinum',
    label: 'PLATINUM',
    backgroundColor: 'rgb(180, 199, 220)',
    textColor: 'black'
  }
}

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

  let tier = undefined
  if (protonDBTier && tiers[protonDBTier]) {
    if (tiers[protonDBTier]) {
      tier = tiers[protonDBTier]
    } else {
      tier = tiers.pending
    }
  }
  return { protonDBTier: tier, linuxSupport, refresh }
}

export default useBadgeData
