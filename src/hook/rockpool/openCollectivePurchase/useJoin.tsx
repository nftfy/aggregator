import { usePrepareContractWrite, useSendTransaction } from 'wagmi'
import { chainConfig } from '../../../ChainConfig'
import { SpecificPoolItem } from '../../../models/rockpool/SpecificPoolsTypes'
import { units } from '../../../services/UtilService'
import { useObserverTransaction } from '../../shared/useObserveTransaction'
import perpetualOpenCollectivePurchaseAbi from './openCollectivePurchaseAbi.json'

const useJoin = (chainId: number, specificPoolItem: SpecificPoolItem, value: string) => {
  const { products, nativeToken } = chainConfig(chainId)
  const amountInUnits = units(value, specificPoolItem.paymentToken.decimals || 0)
  const reservePriceInUnits = units(specificPoolItem.reservePrice || '0', specificPoolItem.paymentToken.decimals)
  const isNetworkToken = specificPoolItem.paymentToken.id === nativeToken.address

  const { config } = usePrepareContractWrite({
    addressOrName: products.specific.contract.openCollectivePurchase,
    contractInterface: perpetualOpenCollectivePurchaseAbi,
    functionName: 'join',
    args: [specificPoolItem.id, amountInUnits, reservePriceInUnits, isNetworkToken ? { value: amountInUnits } : { value: 0 }]
  })
  const { sendTransaction, isSuccess, data, isLoading: isLoadingTransactionWallet } = useSendTransaction(config)
  const { isLoading, status, dismiss } = useObserverTransaction(data, isSuccess, products.specific.subgraph)

  const join = async () => {
    if (sendTransaction) {
      await sendTransaction()
    }
  }

  return {
    join,
    isLoading: isLoading || isLoadingTransactionWallet,
    status,
    dismiss
  }
}

export default useJoin
