import React, { useEffect, useState } from 'react'
import ProtonDBTier from '../../../types/ProtonDBTier'
import { getCache } from '../../cache/protobDbCache'

import style from './style'

type Props = {
  appId: number
}

export default function LibraryTierMarker({ appId }: Props) {
  const [tier, setTier] = useState<ProtonDBTier>()
  useEffect(() => {
    async function getTierFromCache() {
      const protonDBTier = await getCache(appId.toString())
      if (protonDBTier?.tier) {
        setTier(protonDBTier.tier)
      }
    }
    if (appId) {
      getTierFromCache()
    }
  }, [appId])
  if (tier?.length) {
    return (
      <div className="protondb-decky-indicator-library">
        {style}
        <div className={`protondb-decky-indicator-${tier}`}>
          {tier.slice(0, 1).toUpperCase()}
        </div>
      </div>
    )
  }
  return <></>
}
