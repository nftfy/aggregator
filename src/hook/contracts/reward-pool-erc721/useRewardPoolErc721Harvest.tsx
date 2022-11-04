import { Web3Provider } from '@ethersproject/providers'
import { useTransaction } from '@nftfyorg/wallet'
import { useState } from 'react'
import { rewardPoolErc721Contract } from '../../../contracts/reward-pool-erc721/RewardPoolErc721Contract'
import { chainConfig } from '../../../ChainConfig'

export const useRewardPoolErc721Harvest = () => {
  const [isExecuting, setIsExecuting] = useState(false)
  const { observe, status, isLoading, dismiss } = useTransaction()
  const getHarvest = async (signerProvider: Web3Provider, poolAddress: string, rewardToken: string, chainId: number) => {
    const config = chainConfig(chainId)

    setIsExecuting(true)
    const tx = await rewardPoolErc721Contract(signerProvider).harvest(poolAddress, rewardToken)
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
