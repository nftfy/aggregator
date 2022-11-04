import { Web3Provider } from '@ethersproject/providers'
import { useTransaction } from '@nftfyorg/wallet'
import { useState } from 'react'
import { chainConfig } from '../../../ChainConfig'
import { rewardPoolErc721Contract } from '../../../contracts/reward-pool-erc721/RewardPoolErc721Contract'

export const useRewardPoolErc721AddReward = (chainId: number, signerProvider: Web3Provider) => {
  const config = chainConfig(chainId)

  const [isExecuting, setIsExecuting] = useState(false)
  const { isLoading: isCreating, observe, dismiss, status } = useTransaction()

  const addRewardToken = async (poolAddress: string, rewardToken: string): Promise<void> => {
    setIsExecuting(true)

    const tx = await rewardPoolErc721Contract(signerProvider).addRewardToken(poolAddress, rewardToken)

    setIsExecuting(false)

    if (!tx) {
      return
    }

    observe(tx, signerProvider, config.subgraphUrl)
  }

  return {
    status,
    isLoading: isExecuting || isCreating,
    addRewardToken,
    dismiss
  }
}
