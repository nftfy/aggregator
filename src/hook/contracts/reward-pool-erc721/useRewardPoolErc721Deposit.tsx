import { useState } from 'react'
import { usePrepareContractWrite, useSendTransaction } from 'wagmi'
import { rewardPoolErc721Abi } from '../../../contracts/reward-pool-erc721/RewardPoolErc721Abi'
import { useObserverTransaction } from '../useObserveTransaction'

export const useRewardPoolErc721Deposit = (poolAddress: string, tokenIdList: string[]) => {
  const [processing, setProcessing] = useState(false)

  const { config } = usePrepareContractWrite({
    addressOrName: poolAddress,
    contractInterface: rewardPoolErc721Abi,
    functionName: 'deposit',
    args: [tokenIdList, true]
  })
  const { data, sendTransaction, isLoading, isSuccess } = useSendTransaction(config)
  const { isLoading: loading } = useObserverTransaction(data, isSuccess, () => setProcessing(false))

  return {
    status: isSuccess && !loading && !processing,
    isLoading: isLoading || loading,
    deposit: () => {
      if (sendTransaction) {
        setProcessing(true)
        sendTransaction()
      }
    }
  }
}
