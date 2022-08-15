import { Button, ButtonProps, Router, ServerAPI } from 'decky-frontend-lib'
import { ReactElement, useEffect, useState, FC, CSSProperties } from 'react'
import { FaReact } from 'react-icons/fa'
import { IoLogoTux } from 'react-icons/io'

import { appTypes } from '../constants'

import './protonMedal.css'

const tierColours = {
  none: { background: 'white', text: 'black' },
  pending: { background: 'rgb(68, 68, 68)', text: 'white' },
  borked: { background: 'red', text: 'black' },
  bronze: { background: 'rgb(205, 127, 50)', text: 'black' },
  silver: { background: 'rgb(166, 166, 166)', text: 'black' },
  gold: { background: 'rgb(207, 181, 59)', text: 'black' },
  platinum: { background: 'rgb(180, 199, 220)', text: 'black' }
}

type ExtendedButtonProps = ButtonProps & {
  children: ReactElement | ReactElement[]
  type: 'button'
  style: CSSProperties
}

const DeckButton = Button as FC<ExtendedButtonProps>

export default function ProtonMedal({
  serverAPI,
  className
}: {
  serverAPI: ServerAPI
  className: string
}): ReactElement {
  const [protonDBTier, setProtonDBTier] = useState<
    'borked' | 'platinum' | 'gold' | 'silver' | 'bronze' | 'pending' | 'none'
  >()
  const [linuxSupport, setLinuxSupport] = useState<boolean>(false)
  const splitPath = window?.location?.pathname?.split('/')
  // /routes/library/app/:appId but this can contain /tab/YourStuff or other tabs so we have to take the 4th item. Probably a better solution with regex
  const appId = splitPath?.[4]

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
    const appType = appStore.GetAppOverviewByGameID(parseInt(appId))?.app_type
    const isSteamGame = Boolean(appTypes[appType as keyof typeof appTypes])

    if (appId?.length && isSteamGame) {
      getProtonDBInfo()
    }
    return () => {
      ignore = true
    }
  }, [appId])

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
          Boolean(JSON.parse(res.result?.body)?.[appId]?.data?.platforms?.linux)
        )
      } else {
        setLinuxSupport(false)
      }
    }
    const appType = appStore.GetAppOverviewByGameID(parseInt(appId))?.app_type
    const isSteamGame = Boolean(appTypes[appType as keyof typeof appTypes])

    if (appId?.length && isSteamGame) {
      getLinuxInfo()
    }
    return () => {
      ignore = true
    }
  }, [appId])

  const badge = protonDBTier ? (
    <DeckButton
      className={className}
      type="button"
      onClick={() => {
        Router.NavigateToExternalWeb(`https://www.protondb.com/app/${appId}`)
      }}
      style={{
        border: 'none',
        top: 40,
        left: 20,
        position: 'absolute',
        background: (tierColours[protonDBTier] || tierColours.none).background,
        zIndex: 20,
        color: (tierColours[protonDBTier] || tierColours.none).text,
        padding: '6px 18px',
        display: 'flex',
        alignItems: 'center',
        width: 'max-content',
        outlineColor: '#fff0'
      }}
    >
      {linuxSupport ? (
        <IoLogoTux
          size={28}
          color={tierColours[protonDBTier].text === 'white' ? '#fff' : '#000'}
        />
      ) : (
        <></>
      )}
      {/* The ProtonDB logo has a distracting background, so React's logo is being used as a close substitute */}
      <FaReact
        size={28}
        color={tierColours[protonDBTier].text === 'white' ? '#fff' : '#000'}
        style={{ marginLeft: linuxSupport ? 10 : 0 }}
      />
      <span
        style={{
          marginLeft: 10,
          fontSize: 24,
          width: '132px',
          textTransform: 'uppercase',
          fontFamily: 'Abel,"Motiva Sans",Arial,Helvetica,sans-serif',
          lineHeight: '24px',
          marginRight: '28px'
        }}
      >
        {`${protonDBTier?.charAt(0).toUpperCase()}${protonDBTier?.slice(1)}`}
      </span>
    </DeckButton>
  ) : (
    <div />
  )

  return badge
}
