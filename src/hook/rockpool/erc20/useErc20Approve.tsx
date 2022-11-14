import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'
import { useErc20Allowance } from '../../contracts/erc20/useErc20Allowance'
import { useErc20Approval } from '../../contracts/erc20/useErc20Approval'

export function useErc20Approve(chainId: number, account: string, contractAddress: string, spenderAddress: string, amount: string) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const { allowance, isLoading: isLoadingUnlocked, refetch } = useErc20Allowance(account, chainId, contractAddress, spenderAddress)
  const { isLoading, setApproveErc20: unlockErc20, status, dismiss } = useErc20Approval(contractAddress, spenderAddress, amount)

  useEffect(() => {
    if (!isLoadingUnlocked && status === 'success') {
      refetch()
      dismiss()
    }
  }, [dismiss, isLoadingUnlocked, refetch, status])

  useEffect(() => {
    if (new BigNumber(allowance).isGreaterThan(0)) {
      setIsUnlocked(true)
    }
  }, [allowance])

  return {
    isUnlocked,
    isLoading: isLoading || isLoadingUnlocked,
    unlockErc20
  }
}
