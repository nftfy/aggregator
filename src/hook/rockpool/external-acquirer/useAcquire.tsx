import { useEffect, useState } from 'react'
import { usePrepareContractWrite, useSendTransaction } from 'wagmi'
import { chainConfig } from '../../../ChainConfig'
import { nftfyClient } from '../../../graphql/Client'
import { SpecificAcquirerData, SpecificAcquirerDataVars, SPECIFIC_ACQUIRING } from '../../../graphql/nftfy/rockpool/SpecificAcquiring'
import { useObserverTransaction } from '../../shared/useObserveTransaction'
import externalAcquirerAbi from './externalAcquirerAbi.json'
const useAcquire = (chainId: number, specificPoolItemId: string, walletAddress: string, listed: boolean, poolIsCompleted: boolean) => {
  const [dataTx, setDataTx] = useState<string>('')

  const { products } = chainConfig(chainId)
  const { config } = usePrepareContractWrite({
    addressOrName: products.specific.contract.externalAcquirer,
    contractInterface: externalAcquirerAbi,
    functionName: 'acquire',
    args: [specificPoolItemId, true, dataTx]
  })
  const { sendTransaction, isSuccess, data, isLoading } = useSendTransaction(config)
  const { status, dismiss } = useObserverTransaction(data, isSuccess, products.specific.subgraph)

  const getDataForRequest = async () => {
    if (!poolIsCompleted) return
    try {
      const { data, error } = await nftfyClient.query<SpecificAcquirerData, SpecificAcquirerDataVars>({
        query: SPECIFIC_ACQUIRING,
        variables: {
          rockpoolItemAcquiringDataId: specificPoolItemId,
          chainId,
          creator: listed ? null : walletAddress
        }
      })

      if (error) {
        throw error
      }

      if (!data || !data.rockpoolItemAcquiringData) {
        throw new Error()
      }
      setDataTx(data.rockpoolItemAcquiringData.data)
    } catch (error) {
      throw new Error(error as string)
    }
  }
  useEffect(() => {
    const execFunction = async () => {
      await getDataForRequest()
    }
    execFunction()
  }, [])

  const acquire = async () => {
    if (dataTx && sendTransaction) {
      await sendTransaction()
    }
  }

  return {
    acquire,
    isLoading: isLoading,
    status,
    dismiss
  }
}

export default useAcquire
