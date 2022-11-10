import { notification } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { chainConfig } from '../../../ChainConfig'
import { SpecificPoolItem } from '../../../models/rockpool/SpecificPoolsTypes'
import useJoin from '../openCollectivePurchase/useJoin'

export default function useSpecificJoinPool(
  chainId: number,
  accountAddress: string,
  specificPoolItem: SpecificPoolItem,
  value: string,
  refetchData: () => void
) {
  const config = chainConfig(chainId)
  const [isExecution, setIsExecution] = useState(false)
  // const { isUnlocked, unlockErc20 } = useErc20Approve(
  //   chainId,
  //   accountAddress,
  //   specificPoolItem?.paymentToken?.id || '',
  //   config.products.specific.contract.openCollectivePurchase
  // )
  const { join, isLoading, isSuccess, data } = useJoin(chainId, specificPoolItem, value)

  console.log('joinLoading', isLoading)
  console.log('isExecution', isExecution)
  console.log('isSuccess', isSuccess)
  console.log('data', data?.hash)

  const handleJoin = async () => {
    if (!accountAddress || !specificPoolItem) {
      return
    }

    try {
      setIsExecution(true)
      if (specificPoolItem.paymentToken.id !== config.nativeToken.address) {
        // unlockErc20(specificPoolItem?.paymentToken?.id || '', config.products.specific.contract.openCollectivePurchase, value)
      }
      await join()
      setIsExecution(false)
    } catch (_) {
      setIsExecution(false)
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
    if (isSuccess) {
      // refetchData()
      notificationSuccessAddFounds()
    }
    // if (status === 'reverted') {
    //   console.error({
    //     type: 'error',
    //     text: 'error',
    //     duration: 5
    //   })
    // }
  }, [notificationSuccessAddFounds])

  return {
    handleJoin,
    isExecutin: isExecution || isLoading
  }
}
