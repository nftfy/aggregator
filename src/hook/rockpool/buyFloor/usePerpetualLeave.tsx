import { notification } from 'antd'
import { useCallback, useEffect } from 'react'
import { chainConfig } from '../../../ChainConfig'
import useLeaveV2 from '../open-collective-purchaseV2/useLeaveV2'

const usePerpetualLeave = (
  chainId: number,
  collection: string,
  paymentToken: string,
  userParticipation: string,
  refetchData: () => void,
  creatorAddress?: string
) => {
  const { nativeToken } = chainConfig(chainId)
  const {
    leaveV2,
    isLoading: isLoading,
    status,
    dismiss
  } = useLeaveV2(collection, paymentToken, chainId, !creatorAddress?.length ? nativeToken.address : creatorAddress)

  const handleLeave = async () => {
    try {
      await leaveV2()
    } catch (_) {
      console.error({
        type: 'error',
        text: 'error',
        duration: 5
      })
    }
  }

  const notificationRemoveParticipation = useCallback(() => {
    notification.success({
      message: `Funds successfully removed!`,
      description: `Amount removed: ${userParticipation || ''} ${nativeToken.symbol}`,
      placement: 'top',
      duration: 2
    })
  }, [nativeToken.symbol, userParticipation])

  useEffect(() => {
    if (status === 'success') {
      refetchData()
      notificationRemoveParticipation()
      dismiss()
    }
    if (status === 'reverted') {
      console.error({
        type: 'error',
        text: 'error',
        duration: 5
      })
    }
  }, [notificationRemoveParticipation, status])

  return {
    handleLeave,
    isExecutin: isLoading
  }
}

export default usePerpetualLeave
