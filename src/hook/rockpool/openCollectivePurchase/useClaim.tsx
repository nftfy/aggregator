import { useTransaction } from '@nftfyorg/wallet'
import { ethers } from 'ethers'
import { useState } from 'react'
import { chainConfig } from '../../config/ChainConfig'
import { openCollectivePurchase } from '../../contracts/openCollectivePurchase/openCollectivePurchase'

const useClaim = () => {
  const { isLoading: isObserving, status, observe, dismiss } = useTransaction()
  const [isExecuting, setIsExecuting] = useState(false)

  const setClaim = async (signerProvider: ethers.providers.Web3Provider, chainId: number, listingId: string, buyer: string) => {
    const config = chainConfig(chainId)
    setIsExecuting(true)

    const transaction: string = await openCollectivePurchase(signerProvider, chainId).claim(listingId, buyer)

    setIsExecuting(false)

    await observe(transaction, signerProvider, config.specificSubgraph)

    return { transaction }
  }

  return {
    isLoading: isExecuting || isObserving,
    setClaim,
    dismiss,
    status
  }
}

export default useClaim
