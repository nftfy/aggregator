import { useEffect, useState } from 'react'
import { usePrepareContractWrite, useSendTransaction } from 'wagmi'
import { erc1155Abi } from '../../../contracts/erc1155/Erc1155Abi'
import { useObserverTransaction } from '../../shared/useObserveTransaction'
import { UseErc1155IsApprovedForAll } from './useErc1155IsApprovedForAll'

export function useErc1155ApproveForAll(chainId: number, collectionAddress: string, spenderAddress: string, ownerAccount: string) {
  const [isExecuting, setIsExecuting] = useState(false)
  const {
    isApprovedForAll,
    refetch,
    isLoading: isLoadingIsApprovedForAll
  } = UseErc1155IsApprovedForAll(collectionAddress, ownerAccount, spenderAddress, chainId)

  const { config } = usePrepareContractWrite({
    addressOrName: collectionAddress,
    contractInterface: erc1155Abi,
    functionName: 'setApprovalForAll',
    args: [spenderAddress, true]
  })

  const { data, sendTransaction, isSuccess, isLoading } = useSendTransaction(config)
  const { status, dismiss } = useObserverTransaction(data, isSuccess)

  useEffect(() => {
    if (!isLoading && status === 'success') {
      setIsExecuting(false)
      refetch()
      dismiss()
    } else if (status === 'reverted') {
      setIsExecuting(false)
    }
  }, [dismiss, isLoading, refetch, status])

  return {
    isApprovedForAll,
    isLoading: isLoading || isExecuting || isLoadingIsApprovedForAll,
    setApprovalForAll: () => {
      if (sendTransaction) {
        setIsExecuting(true)
        sendTransaction()
      }
    },
    status
  }
}
