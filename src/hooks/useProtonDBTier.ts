import { ServerAPI } from 'decky-frontend-lib'
import { useEffect, useState } from 'react'

const tiers = {
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

const useProtonDBTier = (serverAPI: ServerAPI, appId: string | undefined) => {
  const [protonDBTier, setProtonDBTier] = useState<
    'borked' | 'platinum' | 'gold' | 'silver' | 'bronze' | 'pending'
  >()

  useEffect(() => {
    let ignore = false
    async function getProtonDBInfo() {
      const req = {
        method: 'GET',
        url: `https://www.protondb.com/api/v1/reports/summaries/${appId}.json`
      }
      const res = await serverAPI.callServerMethod<
        { method: string; url: string },
        { body: string; status: number }
      >('http_request', req)
      if (ignore) {
        return
      }
      if (res.success && res.result.status === 200) {
        setProtonDBTier(JSON.parse(res.result?.body).tier)
      } else {
        setProtonDBTier('pending')
      }
    }

    if (appId?.length) {
      getProtonDBInfo()
    }
    return () => {
      ignore = true
    }
  }, [appId])

  return protonDBTier ? tiers[protonDBTier] : undefined
}

export default useProtonDBTier
