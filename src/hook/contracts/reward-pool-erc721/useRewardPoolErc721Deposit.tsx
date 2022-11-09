import { useEffect, useState } from 'react'
import { usePrepareContractWrite, useSendTransaction } from 'wagmi'
import { rewardPoolErc721Abi } from '../../../contracts/reward-pool-erc721/RewardPoolErc721Abi'

export const useRewardPoolErc721Deposit = (poolAddress: string) => {
  const [collectionList, setCollectionList] = useState<string[]>([])
  const { config } = usePrepareContractWrite({
    addressOrName: poolAddress,
    contractInterface: rewardPoolErc721Abi,
    functionName: 'deposit',
    args: [collectionList, true]
  })
  const { sendTransaction, isLoading, isSuccess } = useSendTransaction(config)
  useEffect(() => {
    if (sendTransaction) {
      sendTransaction()
    }
  }, [collectionList, sendTransaction])

  const deposit = async (tokenIdList: string[]) => {
    setCollectionList(tokenIdList)
  }

  return {
    status: isSuccess,
    isLoading: isLoading,
    deposit
  }
}
