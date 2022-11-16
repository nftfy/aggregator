import { notification } from 'antd'
import { ethers } from 'ethers'
import { useCallback, useEffect } from 'react'
import useJoinV2 from '../openCollectivePurchaseV2/useJoinV2'

export default function usePerpetualJoin(
  chainId: number,
  collection: string,
  paymentToken: string,
  amount: ethers.BigNumber,
  maxReservePrice: ethers.BigNumber,
  referralId: number,
  refetchData: () => void,
  creatorAddress?: string
) {
  const { join, isLoading, status, dismiss } = useJoinV2(
    collection,
    paymentToken,
    amount,
    maxReservePrice,
    referralId,
    chainId,
    creatorAddress
  )

  const handleJoin = async () => {
    try {
      await join()
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
      message: `Funds successfully added!`,
      description: `Amount deposited: ${amount} ETH`,
      placement: 'top',
      duration: 2
    })
  }, [amount])

  useEffect(() => {
    if (status === 'success') {
      refetchData()
      notificationSuccessAddFounds()
      dismiss()
    }
    if (status === 'reverted') {
      console.error({
        type: 'error',
        text: 'error',
        duration: 5
      })
    }
  }, [notificationSuccessAddFounds, status])

  return {
    handleJoin,
    isExecutin: isLoading
  }
}
