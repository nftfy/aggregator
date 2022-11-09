import { useTransaction } from '@nftfyorg/wallet'
import { ethers } from 'ethers'
import { useState } from 'react'
import { chainConfig } from '../../config/ChainConfig'
import perpetualOpenCollectivePurchaseV2Contract from '../../contracts/perpetualOpenCollectivePurchaseV2/perpetualOpenCollectivePurchaseV2Contract'

export const usePerpetualJoin = () => {
  const [isExecution, setIsExecution] = useState(false)

  const { status, observe, dismiss } = useTransaction()

  const setPerpetualJoin = async (
    signerProvider: ethers.providers.Web3Provider,
    chainId: number,
    collection: string,
    paymentToken: string,
    amount: ethers.BigNumber,
    maxReservePrice: ethers.BigNumber,
    referralId: number,
    creatorAddress?: string
  ) => {
    try {
      const config = chainConfig(chainId)

      setIsExecution(true)

      const transaction: string = await perpetualOpenCollectivePurchaseV2Contract(signerProvider, chainId).perpetualJoin(
        creatorAddress?.length ? creatorAddress : config.nativeToken.address,
        collection,
        paymentToken,
        amount,
        maxReservePrice,
        referralId
      )

      setIsExecution(false)

      if (!transaction) {
        return
      }

      observe(transaction, signerProvider, config.subgraphUrl)
    } catch (error: Error | unknown) {
      setIsExecution(false)
      console.error(error as string)
    }
  }

  return {
    status,
    isExecuting: isExecution,
    setPerpetualJoin,
    dismiss
  }
}

export default usePerpetualJoin
