import { useEffect, useState } from 'react'
import { usePrepareContractWrite, useSendTransaction } from 'wagmi'
import { rewardPoolErc721Abi } from '../../../contracts/reward-pool-erc721/RewardPoolErc721Abi'
import { useObserverTransaction } from '../../shared/useObserveTransaction'

export const useRewardPoolErc721Withdraw = (poolAddress: string, tokenIdList: string[]) => {
  const [processing, setProcessing] = useState(false)

  const { config } = usePrepareContractWrite({
    addressOrName: poolAddress,
    contractInterface: rewardPoolErc721Abi,
    functionName: 'withdraw',
    args: [tokenIdList, true]
  })
  const { data, sendTransaction, isLoading, isSuccess } = useSendTransaction(config)
  const { isLoading: loading, status, dismiss } = useObserverTransaction(data, isSuccess)
  const withdraw = async () => {
    if (sendTransaction) {
      setProcessing(true)
      sendTransaction()
    }
  }

  useEffect(() => {
    if (status === 'success' && !isLoading) {
      setProcessing(false)
      dismiss()
    }
  }, [status])
  return {
    status,
    confirmed: isSuccess && !loading && !processing,
    isLoading: isLoading || loading,
    withdraw
  }
}
