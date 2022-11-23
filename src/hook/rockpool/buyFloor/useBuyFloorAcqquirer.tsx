import { notification } from 'antd'
import { useCallback, useEffect } from 'react'
import useAcquireV2 from '../external-acquirerV2/useAcquirerV2'

export default function useBuyFloorAcquirerV2(
  chainId: number,
  tokenId: string,
  poolId: string,
  poolIsCompleted: boolean,
  collectionAddress: string,
  refetchData: () => void
) {
  const { acquire, status, dismiss, isLoading } = useAcquireV2(chainId, tokenId, poolId, poolIsCompleted, collectionAddress)
  const handleSpecificAcquire = async () => {
    try {
      await acquire()
    } catch (_) {
      console.error({
        type: 'error',
        text: 'error',
        duration: 5
      })
    }
  }

  const notificationSuccessAddFounds = useCallback(() => {
    notification.success({
      message: `Buy NFT successfully`,
      description: `successfully`,
      placement: 'top',
      duration: 2
    })
  }, [])

  useEffect(() => {
    if (status === 'success') {
      refetchData()
      dismiss()
      notificationSuccessAddFounds()
    }
    if (status === 'reverted') {
      console.error({
        type: 'error',
        text: 'error',
        duration: 5
      })
    }
  }, [status, dismiss, refetchData, notificationSuccessAddFounds])

  return {
    handleSpecificAcquire,
    isExecutin: isLoading
  }
}
