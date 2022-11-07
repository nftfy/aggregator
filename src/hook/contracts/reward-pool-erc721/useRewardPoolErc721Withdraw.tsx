import { Web3Provider } from '@ethersproject/providers'
import { useState } from 'react'
import { rewardPoolErc721Contract } from '../../../contracts/reward-pool-erc721/RewardPoolErc721Contract'

export const useRewardPoolErc721Withdraw = () => {
  const [isExecuting, setIsExecuting] = useState(false)

  const withdraw = async (poolAddress: string, tokenIdList: string[], signerProvider: Web3Provider, chainId: number) => {
    setIsExecuting(true)
    const tx = await rewardPoolErc721Contract(signerProvider).withdraw(poolAddress, tokenIdList)
    setIsExecuting(false)

    if (!tx) {
      return
    }
  }

  return {
    status: true,
    isLoading: isExecuting,
    withdraw,
    dismiss: () => {}
  }
}
