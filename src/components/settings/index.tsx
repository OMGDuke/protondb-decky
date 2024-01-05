import {
  ButtonItem,
  ButtonItemProps,
  DropdownItem,
  PanelSection,
  PanelSectionProps,
  PanelSectionRow,
  ServerAPI
} from 'decky-frontend-lib'
import React, { FC, ReactNode } from 'react'
import { clearCache } from '../../cache/protobDbCache'
import useTranslations from '../../hooks/useTranslations'
import { useSettings } from '../../hooks/useSettings'

type ExtendedPanelSectionProps = PanelSectionProps & {
  children: ReactNode
}

const DeckPanelSection = PanelSection as FC<ExtendedPanelSectionProps>

type PanelSectionRowProps = {
  children: ReactNode
}

const DeckPanelSectionRow = PanelSectionRow as FC<PanelSectionRowProps>

type ExtendedButtonItemProps = ButtonItemProps & {
  children: ReactNode
}

const DeckButtonItem = ButtonItem as FC<ExtendedButtonItemProps>

export default function Index({ serverAPI }: { serverAPI: ServerAPI }) {
  const { settings, setSize, setPosition, setLabelOnHover } =
    useSettings(serverAPI)
  const t = useTranslations()

  const sizeOptions = [
    { data: 0, label: t('sizeRegular'), value: 'regular' },
    { data: 1, label: t('sizeSmall'), value: 'small' },
    { data: 2, label: t('sizeMinimalist'), value: 'minimalist' }
  ] as const

  const positionOptions = [
    { data: 0, label: t('positionTopLeft'), value: 'tl' },
    { data: 1, label: t('positionTopRight'), value: 'tr' }
  ] as const

  const hoverTypeOptions = [
    { data: 0, label: t('expandOnHoverOff'), value: 'off' },
    { data: 1, label: t('sizeSmall'), value: 'small' },
    { data: 2, label: t('sizeRegular'), value: 'regular' }
  ] as const
  return (
    <div>
      <DeckPanelSection title={t('settings')}>
        <DeckPanelSectionRow>
          <DropdownItem
            label={t('badgeSize')}
            description={t('badgeSizeDescription')}
            menuLabel={t('badgeSize')}
            rgOptions={sizeOptions.map((o) => ({
              data: o.data,
              label: o.label
            }))}
            selectedOption={
              sizeOptions.find((o) => o.value === settings.size)?.data || 0
            }
            onChange={(newVal: { data: number; label: string }) => {
              const newSize =
                sizeOptions.find((o) => o.data === newVal.data)?.value ||
                'regular'
              setSize(newSize)
            }}
          />
        </DeckPanelSectionRow>
        {settings.size === 'minimalist' ? (
          <DeckPanelSectionRow>
            <DropdownItem
              label={t('expandOnHover')}
              description={t('expandOnHoverDescription')}
              menuLabel={t('expandOnHover')}
              rgOptions={hoverTypeOptions.map((o) => ({
                data: o.data,
                label: o.label
              }))}
              selectedOption={
                hoverTypeOptions.find(
                  (o) => o.value === settings.labelTypeOnHover
                )?.data || 0
              }
              onChange={(newVal: { data: number; label: string }) => {
                const newHoverType =
                  hoverTypeOptions.find((o) => o.data === newVal.data)?.value ||
                  'off'
                setLabelOnHover(newHoverType)
              }}
            />
          </DeckPanelSectionRow>
        ) : (
          ''
        )}
        <DeckPanelSectionRow>
          <DropdownItem
            label={t('badgePosition')}
            description={t('badgePositionDescription')}
            menuLabel={t('badgePosition')}
            rgOptions={positionOptions.map((o) => ({
              data: o.data,
              label: o.label
            }))}
            selectedOption={
              positionOptions.find((o) => o.value === settings.position)
                ?.data || 0
            }
            onChange={(newVal: { data: number; label: string }) => {
              const newPosition =
                positionOptions.find((o) => o.data === newVal.data)?.value ||
                'tl'
              setPosition(newPosition)
            }}
          />
        </DeckPanelSectionRow>
      </DeckPanelSection>
      <DeckPanelSection title={t('caching')}>
        <DeckPanelSectionRow>
          <DeckButtonItem
            label={t('clearCacheLabel')}
            bottomSeparator="none"
            layout="below"
            onClick={() => clearCache()}
          >
            {t('clearCache')}
          </DeckButtonItem>
        </DeckPanelSectionRow>
      </DeckPanelSection>
    </div>
  )
}
