import { useEffect, useState } from 'react'
import { usePrepareContractWrite, useSendTransaction } from 'wagmi'
import { rewardPoolErc721Abi } from '../../../contracts/reward-pool-erc721/RewardPoolErc721Abi'
import { useObserverTransaction } from '../../shared/useObserveTransaction'

export const useRewardPoolErc721Deposit = (poolAddress: string, tokenIdList: string[]) => {
  const [processing, setProcessing] = useState(false)

  const { config } = usePrepareContractWrite({
    addressOrName: poolAddress,
    contractInterface: rewardPoolErc721Abi,
    functionName: 'deposit',
    args: [tokenIdList, true]
  })
  const { data, sendTransaction, isLoading, isSuccess } = useSendTransaction(config)
  const { isLoading: loading, status, dismiss } = useObserverTransaction(data, isSuccess)

  useEffect(() => {
    if (status === 'success') {
      setProcessing(false)
      dismiss()
    }
    if (status === 'reverted') {
      console.error({
        type: 'error',
        text: 'error',
        duration: 5
      })
    }
  }, [status])

  return {
    status,
    isSuccess: isSuccess && !loading && !processing,
    isLoading: isLoading || loading,
    deposit: () => {
      if (sendTransaction) {
        setProcessing(true)
        sendTransaction()
      }
    }
  }
}
