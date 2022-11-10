import { useEffect } from 'react'
import { UseErc1155IsApprovedForAll } from './useErc1155IsApprovedForAll'
import { useErc1155SetApprovalForAll } from './useErc1155SetApprovalForAll'

export function useErc1155ApproveForAll(chainId: number, collectionAddress: string, spenderAddress: string, ownerAccount: string) {
  const { isApprovedForAll, refetch, isLoading } = UseErc1155IsApprovedForAll(collectionAddress, ownerAccount, spenderAddress, chainId)
  const { setApprovalForAll, status, isLoading: isSetApproveLoading, dismiss } = useErc1155SetApprovalForAll()

  useEffect(() => {
    if (!isSetApproveLoading && status === 'success') {
      refetch()
      dismiss()
    }
  }, [dismiss, isSetApproveLoading, refetch, status])

  return {
    isApprovedForAll,
    isLoading: isLoading || isSetApproveLoading,
    setApprovalForAll
  }
}
