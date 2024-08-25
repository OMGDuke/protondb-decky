import { fetchNoCors } from '@decky/api'
import { useEffect, useState } from 'react'
import { appTypes } from '../constants'
import { useParams } from './useParams'

function cleanString(str: string) {
  return str
    .replace(/['"\u0040\u0026\u2122\u00ae]/g, '')
    .toLowerCase()
    .trim()
}

const useAppId = () => {
  const [appId, setAppId] = useState<string>()
  const { appid: pathId } = useParams<{ appid: string }>()

  useEffect(() => {
    let ignore = false
    async function getNonSteamAppId(gameName: string) {
      if (ignore) {
        return
      }

      try {
        const res = await fetchNoCors(
          `https://steamcommunity.com/actions/SearchApps/${gameName}`,
          {
            method: 'GET'
          }
        );
    
        if (res.status === 200) {
          const options = await res.json() as {
            appid: string
            name: string
          }[]
          const appId = options.find((o) => {
            return cleanString(o.name) === cleanString(gameName)
          })?.appid
          setAppId(appId)
          return
        }
      } catch (error) {
       console.error(error); 
      }
      setAppId(undefined)
    }
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
