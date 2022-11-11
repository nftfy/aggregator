import { notification } from 'antd'
import { useCallback, useEffect } from 'react'
import useClaim from '../openCollectivePurchase/useClaim'

export default function useClaimFractions(chainId: number, poolId: string, buyer: string, refetchData: () => void) {
  const { setClaim, dismiss, status, isLoading } = useClaim(chainId, poolId, buyer)

  const handleClaimFractions = async () => {
    try {
      await setClaim()
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
      message: `Claim fraction successfully`,
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
  }, [status, refetchData, notificationSuccessAddFounds])

  return {
    handleClaimFractions,
    isExecutin: isLoading
  }
}
