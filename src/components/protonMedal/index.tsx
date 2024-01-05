import { Navigation, ServerAPI } from 'decky-frontend-lib'
import React, { ReactElement, FC, CSSProperties, ReactNode } from 'react'
import { FaReact } from 'react-icons/fa'
import { IoLogoTux } from 'react-icons/io'

import useAppId from '../../hooks/useAppId'
import useBadgeData from '../../hooks/useBadgeData'
import useTranslations from '../../hooks/useTranslations'

import { Button, ButtonProps } from '../button'

import style from './style'
import { useSettings } from '../../hooks/useSettings'

type ExtendedButtonProps = ButtonProps & {
  children: ReactNode
  type: 'button'
  style?: CSSProperties
  className: string
}

const DeckButton = Button as FC<ExtendedButtonProps>

const positonSettings = {
  tl: { top: '40px', left: '20px' },
  tr: { top: '60px', right: '20px' },
  bl: { bottom: '40px', left: '20px' },
  br: { bottom: '40px', right: '20px' }
}

export default function ProtonMedal({
  serverAPI
}: {
  serverAPI: ServerAPI
}): ReactElement {
  const t = useTranslations()
  const appId = useAppId(serverAPI)
  const { protonDBTier, linuxSupport, refresh } = useBadgeData(serverAPI, appId)

  const { settings } = useSettings(serverAPI)

  if (!protonDBTier) return <></>

  const tierClass = `protondb-decky-indicator-${protonDBTier}` as const
  const nativeClass = linuxSupport ? 'protondb-decky-indicator-native' : ''
  const sizeClass = `protondb-decky-indicator-${
    settings.size || 'regular'
  }` as const

  const labelTypeOnHoverClass =
    settings.size !== 'minimalist' || settings.labelTypeOnHover === 'off'
      ? ''
      : `protondb-decky-indicator-label-on-hover-${settings.labelTypeOnHover}`

  return (
    <div
      className="protondb-decky-indicator-container"
      style={{ position: 'absolute', ...positonSettings[settings.position] }}
    >
      {style}
      <DeckButton
        className={`protondb-decky-indicator ${tierClass} ${nativeClass} ${sizeClass} ${labelTypeOnHoverClass}`}
        type="button"
        onClick={async () => {
          refresh()
          Navigation.NavigateToExternalWeb(
            `https://www.protondb.com/app/${appId}`
          )
        }}
      >
        <div>
          {linuxSupport ? (
            <IoLogoTux
              size={settings.size !== 'regular' ? 20 : 28}
              style={{ marginRight: 10 }}
            />
          ) : (
            <></>
          )}
          {/* The ProtonDB logo has a distracting background, so React's logo is being used as a close substitute */}
          <FaReact size={settings.size !== 'regular' ? 20 : 28} />
        </div>
        <span>
          {settings.size === 'small' ||
          (settings.size === 'minimalist' &&
            settings.labelTypeOnHover !== 'regular')
            ? t(`tierMin${protonDBTier}`)
            : t(`tier${protonDBTier}`)}
        </span>
      </DeckButton>
    </div>
  )
}
