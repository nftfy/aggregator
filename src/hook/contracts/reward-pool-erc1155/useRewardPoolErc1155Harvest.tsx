import { Web3Provider } from '@ethersproject/providers'
import { useState } from 'react'
import { rewardPoolErc1155Contract } from '../../../contracts/reward-pool-erc1155/RewardPoolErc1155Contract'

export const useRewardPoolErc1155Harvest = () => {
  const [isExecuting, setIsExecuting] = useState(false)
  const getHarvest = async (signerProvider: Web3Provider, poolAddress: string, rewardToken: string, chainId: number) => {
    setIsExecuting(true)
    const tx = await rewardPoolErc1155Contract(signerProvider).harvest(poolAddress, rewardToken)
    setIsExecuting(false)

    if (!tx) {
      return
    }
  }

  return {
    loading: isExecuting,
    getHarvest,
    dismiss: () => {},
    status: true
  }
}
