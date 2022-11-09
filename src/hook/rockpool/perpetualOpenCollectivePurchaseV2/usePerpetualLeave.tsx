import { useTransaction } from '@nftfyorg/wallet'
import { ethers } from 'ethers'
import { useState } from 'react'
import { chainConfig } from '../../config/ChainConfig'
import perpetualOpenCollectivePurchaseV2Contract from '../../contracts/perpetualOpenCollectivePurchaseV2/perpetualOpenCollectivePurchaseV2Contract'

const usePerpetualLeave = () => {
  const [isExecuting, setIsExecuting] = useState(false)

  const { status, observe, dismiss } = useTransaction()

  const setPerpetualLeave = async (
    signerProvider: ethers.providers.Web3Provider,
    chainId: number,
    collection: string,
    paymentToken: string,
    creatorAddress?: string
  ) => {
    try {
      const config = chainConfig(chainId)

      setIsExecuting(true)

      const transaction: string = await perpetualOpenCollectivePurchaseV2Contract(signerProvider, chainId).perpetualLeave(
        !creatorAddress?.length ? config.nativeToken.address : creatorAddress,
        collection,
        paymentToken
      )

      setIsExecuting(false)

      if (!transaction) {
        return
      }

      observe(transaction, signerProvider, config.subgraphUrl)
    } catch (error: Error | unknown) {
      setIsExecuting(false)
      throw new Error(error as string)
    }
  }

  return {
    status,
    isLoading: isExecuting,
    setPerpetualLeave,
    dismiss
  }
}

export default usePerpetualLeave
