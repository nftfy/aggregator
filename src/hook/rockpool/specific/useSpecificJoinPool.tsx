import { notification } from 'antd'
import { useCallback, useEffect } from 'react'
import { chainConfig } from '../../../ChainConfig'
import { SpecificPoolItem } from '../../../models/rockpool/SpecificPoolsTypes'
import { useErc20Approve } from '../erc20/useErc20Approve'
import useJoin from '../open-collective-purchase/useJoin'

export default function useSpecificJoinPool(
  chainId: number,
  accountAddress: string,
  specificPoolItem: SpecificPoolItem,
  value: string,
  refetchData: () => void
) {
  const config = chainConfig(chainId)
  const { isUnlocked, unlockErc20 } = useErc20Approve(
    chainId,
    accountAddress,
    specificPoolItem?.paymentToken?.id || '',
    config.products.specific.contract.openCollectivePurchase,
    value
  )
  const { join, isLoading, status, dismiss } = useJoin(chainId, specificPoolItem, value)

  const handleJoin = async () => {
    if (!accountAddress || !specificPoolItem) {
      return
    }

    try {
      if (specificPoolItem.paymentToken.id !== config.nativeToken.address && isUnlocked) {
        unlockErc20 && unlockErc20()
      }
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
      description: `Amount deposited: ${value} ETH`,
      placement: 'top',
      duration: 2
    })
  }, [value])

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
