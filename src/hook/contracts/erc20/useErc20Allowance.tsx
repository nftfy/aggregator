import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { chainConfig } from '../../../ChainConfig'
import {
  TransactionCheckUnlockErc20QueryData,
  TransactionCheckUnlockErc20QueryVars,
  TRANSACTION_CHECK_UNLOCK_ERC20
} from '../../../graphql/nftfy/rockpool/erc20/TransactionCheckUnlockErc20Query'

export function useErc20Allowance(account: string, chainId: number, erc20Address: string, spender: string) {
  const [allowance, setAllowance] = useState<string>('')
  const config = chainConfig(chainId)
  const { loading, refetch } = useQuery<TransactionCheckUnlockErc20QueryData, TransactionCheckUnlockErc20QueryVars>(
    TRANSACTION_CHECK_UNLOCK_ERC20,
    {
      variables: {
        chainId,
        account,
        erc20Address,
        spender
      },
      skip: !account || !erc20Address || erc20Address === config.nativeToken.address || !spender,
      onCompleted: data => {
        setAllowance(data.allowanceErc20)
      },
      onError: data => {
        throw new Error(data.message)
      }
    }
  )
  return {
    allowance,
    isLoading: loading,
    refetch
  }
}
