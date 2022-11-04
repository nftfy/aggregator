import { Web3Provider } from '@ethersproject/providers'
import { useTransaction } from '@nftfyorg/wallet'
import { useState } from 'react'
import { rewardPoolErc1155Contract } from '../../../contracts/reward-pool-erc1155/RewardPoolErc1155Contract'
import { chainConfig } from '../../../ChainConfig'

export const useRewardPoolErc1155Harvest = () => {
  const [isExecuting, setIsExecuting] = useState(false)
  const { observe, status, isLoading, dismiss } = useTransaction()
  const getHarvest = async (signerProvider: Web3Provider, poolAddress: string, rewardToken: string, chainId: number) => {
    const config = chainConfig(chainId)

    setIsExecuting(true)
    const tx = await rewardPoolErc1155Contract(signerProvider).harvest(poolAddress, rewardToken)
    setIsExecuting(false)

    if (!tx) {
      return
    }

    observe(tx, signerProvider, config.subgraphUrl)
  }

  return {
    loading: isLoading || isExecuting,
    getHarvest,
    dismiss,
    status
  }
}
