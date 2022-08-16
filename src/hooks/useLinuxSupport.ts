import { ServerAPI } from 'decky-frontend-lib'
import { useEffect, useState } from 'react'

const useLinuxSupport = (serverAPI: ServerAPI, appId: string | undefined) => {
  const [linuxSupport, setLinuxSupport] = useState<boolean>(false)

  useEffect(() => {
    let ignore = false
    async function getLinuxInfo() {
      const req = {
        method: 'GET',
        url: `https://www.protondb.com/proxy/steam/api/appdetails/?appids=${appId}`
      }
      const res = await serverAPI.callServerMethod<
        { method: string; url: string },
        { body: string; status: number }
      >('http_request', req)
      if (ignore) {
        return
      }
      if (res.success && res.result.status === 200) {
        setLinuxSupport(
          Boolean(
            JSON.parse(res.result?.body)?.[appId as string]?.data?.platforms
              ?.linux
          )
        )
      } else {
        setLinuxSupport(false)
      }
    }

    if (appId?.length) {
      getLinuxInfo()
    }
    return () => {
      ignore = true
    }
  }, [appId])

  return linuxSupport
}

export default useLinuxSupport
