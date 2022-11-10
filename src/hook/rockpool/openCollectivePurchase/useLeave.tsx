import { useTransaction } from '@nftfyorg/wallet'
import { ethers } from 'ethers'
import { useState } from 'react'
import { chainConfig } from '../../config/ChainConfig'
import { openCollectivePurchase } from '../../contracts/openCollectivePurchase/openCollectivePurchase'
import { SpecificPoolItem } from '../../types/models/SpecificPoolsTypes'

const useLeave = () => {
  const [isExecuting, setIsExecuting] = useState(false)

  const { status, observe, dismiss } = useTransaction()

  const leave = async (signerProvider: ethers.providers.Web3Provider, chainId: number, specificPoolItem: SpecificPoolItem) => {
    const config = chainConfig(chainId)

    setIsExecuting(true)

    const transaction: string = await openCollectivePurchase(signerProvider, chainId).leave(specificPoolItem)

    setIsExecuting(false)

    if (!transaction) {
      return
    }

    observe(transaction, signerProvider, config.specificSubgraph)
  }

  return {
    leave,
    isLoading: isExecuting,
    status,
    dismiss
  }
}

export default useLeave
