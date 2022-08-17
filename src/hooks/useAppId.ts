import { ServerAPI } from 'decky-frontend-lib'
import { useEffect, useState } from 'react'
import { appTypes } from '../constants'

function cleanString(str: string) {
  return str
    .replace(/['"\u0040\u0026\u2122\u00ae]/g, '')
    .toLowerCase()
    .trim()
}

const useAppId = (serverAPI: ServerAPI) => {
  const [appId, setAppId] = useState<string>()

  useEffect(() => {
    let ignore = false
    async function getNonSteamAppId(gameName: string) {
      const req = {
        method: 'GET',
        url: `https://steamcommunity.com/actions/SearchApps/${gameName}`
      }
      const res = await serverAPI.callServerMethod<
        { method: string; url: string },
        { body: string; status: number }
      >('http_request', req)
      if (ignore) {
        return
      }
      if (res.success && res.result.status === 200) {
        const options = JSON.parse(res.result.body) as {
          appid: string
          name: string
        }[]
        const appId = options.find((o) => {
          return cleanString(o.name) === cleanString(gameName)
        })?.appid
        setAppId(appId)
      } else {
        setAppId(undefined)
      }
    }
    const splitPath = window?.location?.pathname?.split('/')
    // TODO: /routes/library/app/:appId but this can contain /tab/YourStuff or other tabs so we have to take the 4th item. Probably a better solution with regex
    const pathId = splitPath?.[4]
    const appDetails = appStore.GetAppOverviewByGameID(parseInt(pathId))
    const isSteamGame = Boolean(
      appTypes[appDetails?.app_type as keyof typeof appTypes]
    )
    if (isSteamGame) {
      setAppId(pathId)
    } else {
      getNonSteamAppId(appDetails?.display_name)
    }
    return () => {
      ignore = true
    }
  }, [])
  return appId
}

export default useAppId
