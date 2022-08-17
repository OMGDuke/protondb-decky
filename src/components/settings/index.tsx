import {
  DropdownItem,
  PanelSection,
  PanelSectionProps,
  PanelSectionRow
} from 'decky-frontend-lib'
import React, { FC, ReactNode } from 'react'
import { useSettings } from '../../context/settingsContext'

type ExtendedPanelSectionProps = PanelSectionProps & {
  children: ReactNode
}

const DeckPanelSection = PanelSection as FC<ExtendedPanelSectionProps>

type PanelSectionRowProps = {
  children: ReactNode
}

const DeckPanelSectionRow = PanelSectionRow as FC<PanelSectionRowProps>

const sizeOptions = [
  { data: 0, label: 'Regular', value: 'regular' },
  { data: 1, label: 'Small', value: 'small' },
  { data: 2, label: 'Minimalist', value: 'minimalist' }
] as const

const positionOptions = [
  { data: 0, label: 'Top Left', value: 'tl' },
  { data: 1, label: 'Top Right', value: 'tr' }
  // TODO: These can be reenabled once we're properly injecting into topcapsule
  // { data: 2, label: 'Bottom Left', value: 'bl' },
  // { data: 3, label: 'Bottom Right', value: 'br' }
] as const

export default function Index() {
  const { state, dispatch } = useSettings()
  return (
    <DeckPanelSection>
      <DeckPanelSectionRow>
        <DropdownItem
          label="Badge Size"
          description="Choose a different size for the badge"
          menuLabel="Badge Size"
          rgOptions={sizeOptions.map((o) => ({
            data: o.data,
            label: o.label
          }))}
          selectedOption={
            sizeOptions.find((o) => o.value === state.size)?.data || 0
          }
          onChange={(newVal: { data: number; label: string }) => {
            const newSize =
              sizeOptions.find((o) => o.data === newVal.data)?.value ||
              'regular'
            dispatch({
              type: 'set-size',
              value: newSize
            })
            SteamClient.Storage.SetObject('protondb-badges-settings', {
              size: newSize
            })
          }}
        />
      </DeckPanelSectionRow>
      <DeckPanelSectionRow>
        <DropdownItem
          label="Badge Position"
          description="Positon the badge within the the game page header"
          menuLabel="Badge Position"
          rgOptions={positionOptions.map((o) => ({
            data: o.data,
            label: o.label
          }))}
          selectedOption={
            positionOptions.find((o) => o.value === state.position)?.data || 0
          }
          onChange={(newVal: { data: number; label: string }) => {
            const newPosition =
              positionOptions.find((o) => o.data === newVal.data)?.value || 'tl'
            dispatch({
              type: 'set-position',
              value: newPosition
            })
            SteamClient.Storage.SetObject('protondb-badges-settings', {
              position: newPosition
            })
          }}
        />
      </DeckPanelSectionRow>
    </DeckPanelSection>
  )
}
