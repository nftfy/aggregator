import { notification } from 'antd'
import { useCallback, useEffect } from 'react'
import { SpecificPoolItem } from '../../../models/rockpool/SpecificPoolsTypes'
import useLeave from '../openCollectivePurchase/useLeave'

export default function useSpecificLeavePool(
  chainId: number,
  specificPoolItem: SpecificPoolItem,
  userParticipation: string,
  refetchData: () => void
) {
  const { leave, status, dismiss, isLoading } = useLeave(chainId, specificPoolItem)
  const handleLeave = async () => {
    try {
      await leave()
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
      message: `Funds successfully removed!`,
      description: `Amount removed: ${userParticipation || ''} ETH`,
      placement: 'top',
      duration: 2
    })
  }, [userParticipation])

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
    handleLeave,
    isExecutin: isLoading
  }
}
