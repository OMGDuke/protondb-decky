import { PanelSection, PanelSectionRow, ToggleField } from 'decky-frontend-lib'
import React, { useEffect } from 'react'
import { useSettings } from '../../context/settingsContext'

export default function Index() {
  const { state, dispatch } = useSettings()

  useEffect(() => {
    SteamClient.Storage.SetObject('protondb-badges-settings', {
      minimalist: state.minimalist
    })
  }, [state])

  return (
    <PanelSection>
      <PanelSectionRow>
        <ToggleField
          label="Minimalist Mode"
          description="Enables small ProtonDB Badges"
          checked={state.minimalist}
          onChange={(value: boolean) => {
            dispatch({ type: 'set-minimalist', value: Boolean(value) })
          }}
        />
      </PanelSectionRow>
    </PanelSection>
  )
}
