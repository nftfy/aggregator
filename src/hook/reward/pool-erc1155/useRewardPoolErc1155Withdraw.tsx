import { usePrepareContractWrite, useSendTransaction } from 'wagmi'
import { rewardPoolErc1155Abi } from '../../../contracts/reward-pool-erc1155/RewardPoolErc1155Abi'
import { useObserverTransaction } from '../../shared/useObserveTransaction'

export function useRewardPoolWithdrawErc1155(poolAddress: string, tokenIdList: string[], amounts: string[]) {
  const { config } = usePrepareContractWrite({
    addressOrName: poolAddress,
    contractInterface: rewardPoolErc1155Abi,
    functionName: 'withdraw',
    args: [tokenIdList, amounts, true]
  })
  const { data, sendTransaction, isSuccess } = useSendTransaction(config)
  const { isLoading, status, dismiss } = useObserverTransaction(data, isSuccess)

  return {
    status,
    isLoading,
    withdraw: sendTransaction,
    dismiss
  }
}
