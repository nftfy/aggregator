import { Web3Provider } from '@ethersproject/providers'
import { useState } from 'react'
import { rewardPoolErc1155Contract } from '../../../contracts/reward-pool-erc1155/RewardPoolErc1155Contract'

export function useRewardPoolWithdrawErc1155() {
  const [isExecuting, setIsExecuting] = useState(false)

  const withdraw = async (poolAddress: string, tokenIdList: string[], amounts: string[], signerProvider: Web3Provider, chainId: number) => {
    setIsExecuting(true)
    const tx = await rewardPoolErc1155Contract(signerProvider).withdraw(poolAddress, tokenIdList, amounts)
    setIsExecuting(false)

    if (!tx) {
      return
    }
  }

  return {
    status,
    isLoading: isExecuting,
    withdraw,
    dismiss: () => {}
  }
}
