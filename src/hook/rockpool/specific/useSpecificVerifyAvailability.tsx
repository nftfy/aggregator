import { ethers } from 'ethers'
import { useEffect } from 'react'
import { openCollectivePurchase } from '../../../contracts/rockpool/openCollectivePurchase/openCollectivePurchase'
import { SpecificPoolItem } from '../../../models/rockpool/SpecificPoolsTypes'
export const useSpecificVerifyAvailability = (
  chainId: number,
  signerProvider: ethers.providers.Web3Provider | null,
  specificItem?: SpecificPoolItem
) => {
  useEffect(() => {
    const handleAvailability = async () => {
      if (specificItem && signerProvider) {
        if (!specificItem.listed) {
          await openCollectivePurchase(signerProvider, chainId).verifyRockpoolAvailability(specificItem?.id, specificItem.creator)
          return
        }

        await openCollectivePurchase(signerProvider, chainId).verifyRockpoolAvailability(specificItem?.id)
      }
    }
    handleAvailability()
  }, [chainId, signerProvider, specificItem])
}
