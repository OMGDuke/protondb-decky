import { Navigation, ServerAPI } from 'decky-frontend-lib'
import { ReactElement, FC, CSSProperties, ReactNode } from 'react'
import { FaReact } from 'react-icons/fa'
import { IoLogoTux } from 'react-icons/io'

import { useSettings } from '../../context/settingsContext'

import useAppId from '../../hooks/useAppId'
import useBadgeData from '../../hooks/useBadgeData'
import useTranslations from '../../hooks/useTranslations'

import { Button, ButtonProps } from '../button'

import style from './style'

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

  const { state } = useSettings()

  if (!protonDBTier) return <></>

  const tierClass = `protondb-decky-indicator-${protonDBTier}` as const
  const nativeClass = linuxSupport ? 'protondb-decky-indicator-native' : ''
  const sizeClass = `protondb-decky-indicator-${
    state.size || 'regular'
  }` as const

  const labelTypeOnHoverClass =
    state.size !== 'minimalist' || state.labelTypeOnHover === 'off'
      ? ''
      : `protondb-decky-indicator-label-on-hover-${state.labelTypeOnHover}`

  return (
    <div
      className="protondb-decky-indicator-container"
      style={{ position: 'absolute', ...positonSettings[state.position] }}
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
              size={state.size !== 'regular' ? 20 : 28}
              style={{ marginRight: 10 }}
            />
          ) : (
            <></>
          )}
          {/* The ProtonDB logo has a distracting background, so React's logo is being used as a close substitute */}
          <FaReact size={state.size !== 'regular' ? 20 : 28} />
        </div>
        <span>
          {state.size === 'small' ||
          (state.size === 'minimalist' && state.labelTypeOnHover !== 'regular')
            ? t(`tierMin${protonDBTier}`)
            : t(`tier${protonDBTier}`)}
        </span>
      </DeckButton>
    </div>
  )
}
