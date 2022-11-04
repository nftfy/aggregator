import { Web3Provider } from '@ethersproject/providers'
import { useTransaction } from '@nftfyorg/wallet'
import { useState } from 'react'
import { chainConfig } from '../../../ChainConfig'
import { rewardPoolErc1155Contract } from '../../../contracts/reward-pool-erc1155/RewardPoolErc1155Contract'

export function useRewardPoolWithdrawErc1155() {
  const [isExecuting, setIsExecuting] = useState(false)
  const { isLoading: isCreating, observe, dismiss, status } = useTransaction()

  const withdraw = async (poolAddress: string, tokenIdList: string[], amounts: string[], signerProvider: Web3Provider, chainId: number) => {
    const config = chainConfig(chainId)

    setIsExecuting(true)
    const tx = await rewardPoolErc1155Contract(signerProvider).withdraw(poolAddress, tokenIdList, amounts)
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
