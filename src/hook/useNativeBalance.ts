import { useQuery } from '@apollo/client'
import { NativeBalanceQueryData, NativeBalanceQueryVars, NATIVE_BALANCE_QUERY } from '../graphql/nftfy/NativeBalanceQuery'

export const useNativeBalance = (accountAddress: string, chainId: number) => {
  const { data, loading, error, refetch } = useQuery<NativeBalanceQueryData, NativeBalanceQueryVars>(NATIVE_BALANCE_QUERY, {
    notifyOnNetworkStatusChange: true,
    skip: !accountAddress,
    variables: {
      chainId,
      address: accountAddress
    },
    onError: () => {
      console.error({
        type: 'error',
        text: 'error',
        duration: 5
      })
    }
  })

  return {
    loading,
    error,
    refetch,
    balance: data?.nativeBalance || '0'
  }
}
