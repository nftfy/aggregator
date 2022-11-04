import { Web3Provider } from '@ethersproject/providers'
import { useTransaction } from '@nftfyorg/wallet'
import { useState } from 'react'
import { chainConfig } from '../../../ChainConfig'
import { rewardPoolErc721FactoryContract } from '../../../contracts/reward-pool-erc721/RewardPoolErc721FactoryContract'

export const useRewardPoolErc721Factory = (chainId: number, signerProvider: Web3Provider) => {
  const config = chainConfig(chainId)

  const [isExecuting, setIsExecuting] = useState(false)
  const { isLoading: isCreating, observe, dismiss, status } = useTransaction()

  const createPool = async (collectionAddress: string): Promise<string> => {
    if (!config.hub?.contract.erc721Factory) {
      return ''
    }

    setIsExecuting(true)

    const transaction = await rewardPoolErc721FactoryContract(config.hub.contract.erc721Factory, signerProvider).createPool(
      collectionAddress
    )

    if (!transaction?.hash) {
      setIsExecuting(false)
      return ''
    }

    observe(transaction.hash, signerProvider, config.subgraphUrl)

    const transactionReceipt = await transaction.wait()
    setIsExecuting(false)

    return transactionReceipt.events?.shift()?.address || ''
  }

  return {
    status,
    isLoading: isExecuting || isCreating,
    createPool,
    dismiss
  }
}
