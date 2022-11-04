import { useQuery } from '@apollo/client'
import { Erc20BalanceQueryData, Erc20BalanceQueryVars, ERC20_BALANCE } from '@graphql/erc20/ERC20BalanceQuery'
import { chainConfig } from '../ChainConfig'
import { NativeBalanceQueryData, NativeBalanceQueryVars, NATIVE_BALANCE_QUERY } from '../graphql/native/NativeBalance'

export const useAccountBalance = (chainId: number, accountAddress: string, erc20Address?: string) => {
  const { nativeToken } = chainConfig(chainId)
  const { data: erc20Balance, loading: isErc20Loading } = useQuery<Erc20BalanceQueryData, Erc20BalanceQueryVars>(ERC20_BALANCE, {
    notifyOnNetworkStatusChange: true,
    variables: {
      chainId,
      erc20Address: erc20Address ?? '',
      accountAddress: accountAddress ?? ''
    },
    skip: !chainId || !erc20Address || nativeToken.address === erc20Address || !accountAddress
  })

  const { data: nativeBalance, loading: isNativeLoading } = useQuery<NativeBalanceQueryData, NativeBalanceQueryVars>(NATIVE_BALANCE_QUERY, {
    notifyOnNetworkStatusChange: true,
    variables: {
      chainId,
      accountAddress
    },
    skip: !chainId || !accountAddress
  })

  return {
    erc20Balance: erc20Balance?.erc20Balance.balance || '0',
    nativeBalance: nativeBalance?.nativeBalance || '0',
    loading: isErc20Loading || isNativeLoading
  }
}
