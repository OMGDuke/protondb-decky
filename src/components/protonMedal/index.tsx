import { Button, ButtonProps, Router, ServerAPI } from 'decky-frontend-lib'
import { ReactElement, FC, CSSProperties, ReactNode } from 'react'
import { FaReact } from 'react-icons/fa'
import { IoLogoTux } from 'react-icons/io'
import { useSettings } from '../../context/settingsContext'

import useAppId from '../../hooks/useAppId'
import useLinuxSupport from '../../hooks/useLinuxSupport'
import useProtonDBTier from '../../hooks/useProtonDBTier'

import './protonMedal.css'

type ExtendedButtonProps = ButtonProps & {
  children: ReactNode

  type: 'button'
  style: CSSProperties
}

const DeckButton = Button as FC<ExtendedButtonProps>

const positonSettings = {
  tl: { top: '40px', left: '20px' },
  tr: { top: '60px', right: '20px' },
  bl: { bottom: '40px', left: '20px' },
  br: { bottom: '40px', right: '20px' }
}

export default function ProtonMedal({
  serverAPI,
  className
}: {
  serverAPI: ServerAPI
  className: string
}): ReactElement {
  const appId = useAppId(serverAPI)
  const protonDBTier = useProtonDBTier(serverAPI, appId)
  const linuxSupport = useLinuxSupport(serverAPI, appId)

  const { state } = useSettings()

  if (!protonDBTier) return <></>
  const tierClass = `protondb-decky-indicator-${protonDBTier?.key}`
  const nativeClass = linuxSupport ? 'protondb-decky-indicator-native' : ''
  if (state.size === 'minimalist') {
    return (
      <DeckButton
        className={`${className} ${tierClass} ${nativeClass}`}
        type="button"
        onClick={() => {
          Router.NavigateToExternalWeb(`https://www.protondb.com/app/${appId}`)
        }}
        style={{
          background: protonDBTier?.backgroundColor,
          color: protonDBTier?.textColor,
          padding: '6px',
          ...positonSettings[state.position]
        }}
      >
        {linuxSupport ? (
          <IoLogoTux size={20} style={{ marginRight: 10 }} />
        ) : (
          <></>
        )}
        {/* The ProtonDB logo has a distracting background, so React's logo is being used as a close substitute */}
        <FaReact size={20} />
      </DeckButton>
    )
  }

  return (
    <DeckButton
      className={`${className} ${tierClass} ${nativeClass}`}
      type="button"
      onClick={() => {
        Router.NavigateToExternalWeb(`https://www.protondb.com/app/${appId}`)
      }}
      style={{
        background: protonDBTier?.backgroundColor,
        color: protonDBTier?.textColor,
        flexDirection: state.size === 'small' ? 'column' : 'row',
        padding: state.size === 'small' ? '6px 8px ' : '6px 18px',
        ...positonSettings[state.position]
      }}
    >
      <div>
        {linuxSupport ? (
          <IoLogoTux
            size={state.size === 'small' ? 20 : 28}
            style={{ marginRight: 10 }}
          />
        ) : (
          <></>
        )}
        {/* The ProtonDB logo has a distracting background, so React's logo is being used as a close substitute */}
        <FaReact size={state.size === 'small' ? 20 : 28} />
      </div>
      <span
        style={{
          marginLeft: state.size === 'small' ? 0 : '10px',
          fontSize: state.size === 'small' ? '12px' : '24px',
          width: state.size === 'small' ? 'auto' : '132px',
          lineHeight: state.size === 'small' ? '12px' : '24px',
          marginRight: state.size === 'small' ? 0 : '28px'
        }}
      >
        {state.size === 'small'
          ? protonDBTier?.label.slice(0, 4)
          : protonDBTier?.label}
      </span>
    </DeckButton>
  )
}
