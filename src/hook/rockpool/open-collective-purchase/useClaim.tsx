import { usePrepareContractWrite, useSendTransaction } from 'wagmi'
import { chainConfig } from '../../../ChainConfig'
import { useObserverTransaction } from '../../shared/useObserveTransaction'
import perpetualOpenCollectivePurchaseAbi from './openCollectivePurchaseAbi.json'

const useClaim = (chainId: number, listingId: string, buyer: string) => {
  const { products } = chainConfig(chainId)

  const { config } = usePrepareContractWrite({
    addressOrName: products.specific.contract.openCollectivePurchase,
    contractInterface: perpetualOpenCollectivePurchaseAbi,
    functionName: 'claim',
    args: [listingId, buyer]
  })
  const { sendTransaction, isSuccess, data, isLoading } = useSendTransaction(config)
  const { status, dismiss } = useObserverTransaction(data, isSuccess, products.specific.subgraph)

  const setClaim = async () => {
    if (sendTransaction) {
      await sendTransaction()
    }
  }

  return {
    isLoading: isLoading,
    setClaim,
    dismiss,
    status
  }
}

export default useClaim
