import { useEffect } from 'react'
import { usePrepareContractWrite, useSendTransaction } from 'wagmi'
import { erc1155Abi } from '../../../contracts/erc1155/Erc1155Abi'
import { useObserverTransaction } from '../../shared/useObserveTransaction'
import { UseErc1155IsApprovedForAll } from './useErc1155IsApprovedForAll'

export function useErc1155ApproveForAll(chainId: number, collectionAddress: string, spenderAddress: string, ownerAccount: string) {
  const { isApprovedForAll, refetch, isLoading } = UseErc1155IsApprovedForAll(collectionAddress, ownerAccount, spenderAddress, chainId)

  const { config } = usePrepareContractWrite({
    addressOrName: collectionAddress,
    contractInterface: erc1155Abi,
    functionName: 'setApprovalForAll',
    args: [spenderAddress, true]
  })

  const { data, sendTransaction, isSuccess } = useSendTransaction(config)
  const { isLoading: loading, status, dismiss } = useObserverTransaction(data, isSuccess)

  useEffect(() => {
    if (!loading && status === 'success') {
      refetch()
      dismiss()
    }
  }, [dismiss, loading, refetch, status])

  return {
    isApprovedForAll,
    isLoading: isLoading || loading,
    setApprovalForAll: sendTransaction,
    status
  }
}
