import { notification } from 'antd'
import { useCallback, useEffect } from 'react'
import { SpecificPoolItem } from '../../../models/rockpool/SpecificPoolsTypes'
import useAcquire from '../external-acquirer/useAcquire'

export default function useSpecificAcquire(
  chainId: number,
  specificPoolItem: SpecificPoolItem,
  walletAddress: string,
  poolIsCompleted: boolean,
  refetchData: () => void
) {
  const { acquire, status, dismiss, isLoading } = useAcquire(
    chainId,
    specificPoolItem.id,
    walletAddress,
    specificPoolItem.listed,
    poolIsCompleted
  )
  const handleSpecificAcquire = async () => {
    if (!specificPoolItem) {
      return
    }

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
