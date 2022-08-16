import { Button, ButtonProps, Router, ServerAPI } from 'decky-frontend-lib'
import { ReactElement, FC, CSSProperties } from 'react'
import { FaReact } from 'react-icons/fa'
import { IoLogoTux } from 'react-icons/io'

import useAppId from '../../hooks/useAppId'
import useLinuxSupport from '../../hooks/useLinuxSupport'
import useProtonDBTier from '../../hooks/useProtonDBTier'

import './protonMedal.css'

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
  const appId = useAppId(serverAPI)
  const protonDBTier = useProtonDBTier(serverAPI, appId)
  const linuxSupport = useLinuxSupport(serverAPI, appId)
  if (!protonDBTier) return <></>
  return (
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
        background: protonDBTier?.backgroundColor,
        zIndex: 20,
        color: protonDBTier?.textColor,
        padding: '6px 18px',
        display: 'flex',
        alignItems: 'center',
        width: 'max-content',
        outlineColor: '#fff0'
      }}
    >
      {linuxSupport ? (
        <IoLogoTux size={28} color={protonDBTier?.textColor} />
      ) : (
        <></>
      )}
      {/* The ProtonDB logo has a distracting background, so React's logo is being used as a close substitute */}
      <FaReact
        size={28}
        color={protonDBTier?.textColor}
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
        {protonDBTier.label}
      </span>
    </DeckButton>
  )
}
