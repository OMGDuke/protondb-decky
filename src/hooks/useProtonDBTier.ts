import { ServerAPI } from 'decky-frontend-lib'
import { useEffect, useState } from 'react'

const useProtonDBTier = (serverAPI: ServerAPI, appId: string | undefined) => {
  const [protonDBTier, setProtonDBTier] = useState<
    'borked' | 'platinum' | 'gold' | 'silver' | 'bronze' | 'pending' | 'none'
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

  return protonDBTier
}

export default useProtonDBTier
