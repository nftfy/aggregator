import { useEffect, useState } from 'react'
import { usePrepareContractWrite, useSendTransaction } from 'wagmi'
import { rewardPoolErc1155Abi } from '../../../contracts/reward-pool-erc1155/RewardPoolErc1155Abi'
import { useObserverTransaction } from '../../shared/useObserveTransaction'

export function useRewardPoolWithdrawErc1155(poolAddress: string, tokenIdList: string[], amounts: string[]) {
  const [processing, setProcessing] = useState(false)
  const { config } = usePrepareContractWrite({
    addressOrName: poolAddress,
    contractInterface: rewardPoolErc1155Abi,
    functionName: 'withdraw',
    args: [tokenIdList, amounts, true]
  })
  const { data, sendTransaction, isSuccess } = useSendTransaction(config)
  const { isLoading, status, dismiss } = useObserverTransaction(data, isSuccess)

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
    isLoading: isLoading || processing,
    withdraw: () => {
      if (sendTransaction) {
        setProcessing(true)
        sendTransaction()
      }
    },
    dismiss
  }
}
