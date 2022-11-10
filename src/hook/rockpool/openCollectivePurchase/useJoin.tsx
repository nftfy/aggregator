import { useEffect, useState } from 'react'
import { usePrepareContractWrite, useSendTransaction } from 'wagmi'
import { chainConfig } from '../../../ChainConfig'
import { SpecificPoolItem } from '../../../models/rockpool/SpecificPoolsTypes'
import { units } from '../../../services/UtilService'
import perpetualOpenCollectivePurchaseAbi from './openCollectivePurchaseAbi.json'

const useJoin = (chainId: number, specificPoolItem: SpecificPoolItem, value: string) => {
  const [isLoadingTx, setIsLoadingTx] = useState(false)
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
  const { sendTransaction, isLoading, isSuccess, data } = useSendTransaction(config)

  const join = async () => {
    if (sendTransaction) {
      await sendTransaction()
    }
  }

  useEffect(() => {
    const handleWait = async () => {
      await data?.wait()
      setIsLoadingTx(false)
    }
    if (data && isSuccess) {
      setIsLoadingTx(true)
      handleWait()
    }
  }, [data])

  // useEffect(()=>{
  //   if(data && data.hash){
  //     observe(data.hash, ,products.specific.subgraph)
  //   }
  // },[])

  return {
    join,
    isLoading: isLoading || isLoadingTx,
    isSuccess,
    data
  }
}

export default useJoin
