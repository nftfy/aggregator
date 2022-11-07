import { Web3Provider } from '@ethersproject/providers'

import { useState } from 'react'
import { rewardPoolErc721Contract } from '../../../contracts/reward-pool-erc721/RewardPoolErc721Contract'

export const useRewardPoolErc721Harvest = () => {
  const [isExecuting, setIsExecuting] = useState(false)

  const getHarvest = async (signerProvider: Web3Provider, poolAddress: string, rewardToken: string, chainId: number) => {
    setIsExecuting(true)
    const tx = await rewardPoolErc721Contract(signerProvider).harvest(poolAddress, rewardToken)
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
