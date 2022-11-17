import { usePrepareContractWrite, useSendTransaction } from 'wagmi'
import { chainConfig } from '../../../ChainConfig'
import { SpecificPoolItem } from '../../../models/rockpool/SpecificPoolsTypes'
import { useObserverTransaction } from '../../shared/useObserveTransaction'
import perpetualOpenCollectivePurchaseAbi from './openCollectivePurchaseAbi.json'

const useLeave = (chainId: number, specificPoolItem: SpecificPoolItem) => {
  const { products } = chainConfig(chainId)
  const { config } = usePrepareContractWrite({
    addressOrName: products.specific.contract.openCollectivePurchase,
    contractInterface: perpetualOpenCollectivePurchaseAbi,
    functionName: 'leave',
    args: [specificPoolItem.id]
  })
  const { sendTransaction, isSuccess, data, isLoading } = useSendTransaction(config)
  const { status, dismiss } = useObserverTransaction(data, isSuccess, products.specific.subgraph)

  const leave = async () => {
    if (sendTransaction) {
      await sendTransaction()
    }
  }

  return {
    leave,
    isLoading: isLoading,
    status,
    dismiss
  }
}

export default useLeave
