import { usePrepareContractWrite, useSendTransaction } from 'wagmi'
import { rewardPoolErc721Abi } from '../../../contracts/reward-pool-erc721/RewardPoolErc721Abi'

export const useRewardPoolErc721Harvest = (poolAddress: string, rewardToken: string) => {
  const { config } = usePrepareContractWrite({
    addressOrName: poolAddress,
    contractInterface: rewardPoolErc721Abi,
    functionName: 'harvest',
    args: [rewardToken]
  })

  const { sendTransaction, isLoading, isSuccess } = useSendTransaction(config)

  const getHarvest = async () => {
    if (sendTransaction) {
      sendTransaction()
    }
  }
  return {
    loading: isLoading,
    getHarvest,
    status: isSuccess
  }
}
