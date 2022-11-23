import { usePrepareContractWrite, useSendTransaction } from 'wagmi'
import { rewardPoolErc1155Abi } from '../../../contracts/reward-pool-erc1155/RewardPoolErc1155Abi'
import { useObserverTransaction } from '../../shared/useObserveTransaction'

export const useRewardPoolErc1155Harvest = (poolAddress: string, rewardToken: string) => {
  const { config } = usePrepareContractWrite({
    addressOrName: poolAddress,
    contractInterface: rewardPoolErc1155Abi,
    functionName: 'harvest',
    args: [rewardToken]
  })

  const { data, sendTransaction, isSuccess } = useSendTransaction(config)
  const { isLoading: loading, status, dismiss } = useObserverTransaction(data, isSuccess)

  return {
    loading,
    getHarvest: sendTransaction,
    dismiss,
    status
  }
}
