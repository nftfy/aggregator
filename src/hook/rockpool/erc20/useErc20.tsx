import { useQuery } from '@apollo/client'
import { ERC20, Erc20Data, Erc20Vars } from '../../../graphql/nftfy/rockpool/erc20/Erc20Query'

export function useErc20(chainId: number, accountAddress: string) {
  const { data, loading, refetch } = useQuery<Erc20Data, Erc20Vars>(ERC20, {
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
    refetch,
    balance: data?.erc20 || '0'
  }
}
