import { notification } from 'antd'
import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'

export default function useClaimFractions(
  chainId: number,
  refetchData: () => void,
  signerProvider: ethers.providers.Web3Provider | null,
  buyer: string
) {
  const [isExecution, setIsExecution] = useState(false)
  // const { setClaim, dismiss, status } = useClaim()

  const handleClaimFractions = async (poolId: string) => {
    if (!signerProvider || !poolId) {
      return
    }

    try {
      setIsExecution(true)
      // await setClaim(signerProvider, chainId, poolId, buyer)
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
      message: `Claim fraction successfully`,
      description: `successfully`,
      placement: 'top',
      duration: 2
    })
  }, [])

  useEffect(() => {
    if (status === 'success') {
      refetchData()
      // dismiss()
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
    isExecution
  }
}
