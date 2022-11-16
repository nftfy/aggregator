import { usePrepareContractWrite, useSendTransaction } from 'wagmi'
import { chainConfig } from '../../../ChainConfig'
import { useObserverTransaction } from '../../shared/useObserveTransaction'
import perpetualOpenCollectivePurchaseV2Abi from './perpetualOpenCollectivePurchaseV2Abi'

const useLeaveV2 = (collection: string, paymentToken: string, chainId: number, creatorAddress: string) => {
  const { products } = chainConfig(chainId)

  const { config } = usePrepareContractWrite({
    addressOrName: products.buyFloor.contract.perpetualOpenCollectivePurchaseV2,
    contractInterface: perpetualOpenCollectivePurchaseV2Abi,
    functionName: 'perpetualLeave',
    args: [creatorAddress, collection, paymentToken]
  })
  const { sendTransaction, isSuccess, data, isLoading } = useSendTransaction(config)
  const { status, dismiss } = useObserverTransaction(data, isSuccess, products.buyFloor.subgraph)

  const leaveV2 = async () => {
    if (sendTransaction) {
      await sendTransaction()
    }
  }

  return {
    leaveV2,
    isLoading: isLoading,
    status,
    dismiss
  }
}

export default useLeaveV2
