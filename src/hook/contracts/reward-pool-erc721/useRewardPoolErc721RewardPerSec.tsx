import { Web3Provider } from '@ethersproject/providers'
import { useTransaction } from '@nftfyorg/wallet'
import { useState } from 'react'
import { chainConfig } from '../../../ChainConfig'
import { rewardPoolErc721Contract } from '../../../contracts/reward-pool-erc721/RewardPoolErc721Contract'

export const useRewardPoolErc721RewardPerSec = (chainId: number, signerProvider: Web3Provider) => {
  const config = chainConfig(chainId)

  const [isExecuting, setIsExecuting] = useState(false)
  const { isLoading: isCreating, observe, dismiss, status } = useTransaction()

  const updateRewardPerSec = async (poolAddress: string, rewardToken: string, rewardPerSec: string): Promise<string | undefined> => {
    setIsExecuting(true)

    const tx = await rewardPoolErc721Contract(signerProvider).updateRewardPerSec(poolAddress, rewardToken, rewardPerSec)

    setIsExecuting(false)

    if (!tx) {
      return
    }

    observe(tx, signerProvider, config.subgraphUrl)
  }

  return {
    status,
    isLoading: isExecuting || isCreating,
    updateRewardPerSec,
    dismiss
  }
}
