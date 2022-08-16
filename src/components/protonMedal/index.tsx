import { Button, ButtonProps, Router, ServerAPI } from 'decky-frontend-lib'
import { ReactElement, FC, CSSProperties } from 'react'
import { FaReact } from 'react-icons/fa'
import { IoLogoTux } from 'react-icons/io'

import useAppId from '../../hooks/useAppId'
import useLinuxSupport from '../../hooks/useLinuxSupport'
import useProtonDBTier from '../../hooks/useProtonDBTier'

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
  const appId = useAppId(serverAPI)
  const protonDBTier = useProtonDBTier(serverAPI, appId)
  const linuxSupport = useLinuxSupport(serverAPI, appId)

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
