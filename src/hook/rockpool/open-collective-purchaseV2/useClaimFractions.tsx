import { usePrepareContractWrite, useSendTransaction } from 'wagmi'
import { chainConfig } from '../../../ChainConfig'
import { useObserverTransaction } from '../../shared/useObserveTransaction'
import perpetualOpenCollectivePurchaseV2Abi from './perpetualOpenCollectivePurchaseV2Abi'
const useClaimFractions = (chainId: number, listingId: string, buyer: string) => {
  const { products } = chainConfig(chainId)

  const { config } = usePrepareContractWrite({
    addressOrName: products.buyFloor.contract.perpetualOpenCollectivePurchaseV2,
    contractInterface: perpetualOpenCollectivePurchaseV2Abi,
    functionName: 'claim',
    args: [listingId, buyer]
  })
  const { sendTransaction, isSuccess, data, isLoading } = useSendTransaction(config)
  const { status, dismiss } = useObserverTransaction(data, isSuccess, products.buyFloor.subgraph)

  const claim = async () => {
    if (sendTransaction) {
      await sendTransaction()
    }
  }

  return {
    claim,
    isLoading: isLoading,
    status,
    dismiss
  }
}

export default useClaimFractions
