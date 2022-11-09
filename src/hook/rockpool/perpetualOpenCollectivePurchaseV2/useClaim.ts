import { ethers } from 'ethers'
import { useState } from 'react'
import { chainConfig } from '../../../ChainConfig'

const useClaim = () => {
  // const { isLoading: isObserving, status, observe, dismiss } = useTransaction()
  const [isExecuting, setIsExecuting] = useState(false)

  const setClaim = async (signerProvider: ethers.providers.Web3Provider, chainId: number, listingId: number, buyer: string) => {
    const config = chainConfig(chainId)
    setIsExecuting(true)

    const transaction: string = await perpetualOpenCollectivePurchaseV2Contract(signerProvider, chainId).claim(listingId, buyer)

    setIsExecuting(false)

    await observe(transaction, signerProvider, config.subgraphUrl)

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
function perpetualOpenCollectivePurchaseV2Contract(signerProvider: ethers.providers.Web3Provider, chainId: number) {
  throw new Error('Function not implemented.')
}
