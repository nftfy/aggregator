import { Web3Provider } from '@ethersproject/providers'
import { useTransaction } from '@nftfyorg/wallet'
import { useState } from 'react'
import { chainConfig } from '../../../ChainConfig'
import { rewardPoolErc721Contract } from '../../../contracts/reward-pool-erc721/RewardPoolErc721Contract'

export const useRewardPoolErc721Withdraw = () => {
  const [isExecuting, setIsExecuting] = useState(false)
  const { isLoading: isCreating, observe, dismiss, status } = useTransaction()

  const withdraw = async (poolAddress: string, tokenIdList: string[], signerProvider: Web3Provider, chainId: number) => {
    const config = chainConfig(chainId)

    setIsExecuting(true)
    const tx = await rewardPoolErc721Contract(signerProvider).withdraw(poolAddress, tokenIdList)
    setIsExecuting(false)

    if (!tx) {
      return
    }

    observe(tx, signerProvider, config.subgraphUrl)
  }

  return {
    status,
    isLoading: isExecuting || isCreating,
    withdraw,
    dismiss
  }
}
