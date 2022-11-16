import { useEffect, useState } from 'react'
import { usePrepareContractWrite, useSendTransaction } from 'wagmi'
import { chainConfig } from '../../../ChainConfig'
import { nftfyClient } from '../../../graphql/Client'
import { AcquireDataQueryVars, AcquireQueryData, ACQUIRE_DATA_QUERY } from '../../../graphql/nftfy/rockpool/buyfloor/buyFloorAcquireQuery'
import { useObserverTransaction } from '../../shared/useObserveTransaction'
import externalAcquirerV2Abi from './externalAcquirerV2Abi'

const useAcquireV2 = (
  chainId: number,
  tokenId: string,
  specificPoolItemId: string,
  poolIsCompleted: boolean,
  collectionAddress: string
) => {
  const [dataTx, setDataTx] = useState<string>('')

  const { products } = chainConfig(chainId)
  const { config } = usePrepareContractWrite({
    addressOrName: products.buyFloor.contract.externalAcquirerV2,
    contractInterface: externalAcquirerV2Abi,
    functionName: 'acquire',
    args: [specificPoolItemId, true, dataTx]
  })
  const { sendTransaction, isSuccess, data, isLoading } = useSendTransaction(config)
  const { status, dismiss } = useObserverTransaction(data, isSuccess, products.specific.subgraph)

  const getDataForRequest = async () => {
    if (!poolIsCompleted) return
    try {
      const { data, error } = await nftfyClient.query<AcquireQueryData, AcquireDataQueryVars>({
        query: ACQUIRE_DATA_QUERY,
        variables: {
          chainId,
          collectionAddress,
          tokenId
        }
      })

      if (error) {
        throw error
      }

      if (!data || !data.buyFloorAcquireData) {
        throw new Error()
      }
      setDataTx(data.buyFloorAcquireData.acquireData)
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

  const acquireV2 = async () => {
    if (dataTx && sendTransaction) {
      await sendTransaction()
    }
  }

  return {
    acquire: acquireV2,
    isLoading: isLoading,
    status,
    dismiss
  }
}

export default useAcquireV2
