import { useTransaction } from '@nftfyorg/wallet'
import { ethers } from 'ethers'
import { useState } from 'react'
import { chainConfig } from '../../config/ChainConfig'
import externalAcquirerV2Contract from '../../contracts/externalAcquirerV2/externalAcquirerV2Contract'
import { AcquireData } from '../../types/models/acquireData'

const useAcquire = () => {
  const [isExecuting, setIsExecuting] = useState(false)

  const { status, observe, dismiss } = useTransaction()

  const setAcquire = async (
    signerProvider: ethers.providers.Web3Provider,
    chainId: number,
    listingId: string,
    relist: boolean,
    data: AcquireData
  ) => {
    const config = chainConfig(chainId)

    setIsExecuting(true)

    const transaction: string = await externalAcquirerV2Contract(signerProvider, chainId).acquire(listingId, relist, data.acquireData)

    setIsExecuting(false)

    if (!transaction) {
      return
    }

    observe(transaction, signerProvider, config.subgraphUrl)
  }

  return {
    setAcquire,
    isLoading: isExecuting,
    status,
    dismiss
  }
}

export default useAcquire
