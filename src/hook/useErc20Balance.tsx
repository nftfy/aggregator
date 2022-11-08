import { useQuery } from '@apollo/client'
import { chainConfig } from '../ChainConfig'
import { Erc20BalanceQueryData, Erc20BalanceQueryVars, ERC20_BALANCE } from '../graphql/nftfy/Erc20BalanceQuery'
import { coins, formatToLocaleString } from '../services/UtilService'

export const useErc20Balance = (chainId: number, accountAddress: string, erc20Address: string, erc20Decimals: number) => {
  const config = chainConfig(chainId)
  const { data, loading, refetch } = useQuery<Erc20BalanceQueryData, Erc20BalanceQueryVars>(ERC20_BALANCE, {
    notifyOnNetworkStatusChange: true,
    variables: {
      chainId,
      erc20Address,
      accountAddress
    },
    skip: !erc20Address || erc20Address === config.nativeToken.address || !accountAddress || !erc20Decimals,
    onError: errorData => {
      if (errorData.networkError) {
        console.error(errorData.networkError, 'Failed to obtain data')
      }
    }
  })

  const erc20Balance = data?.erc20Balance.balance ? formatToLocaleString(coins(data?.erc20Balance.balance, erc20Decimals), 5) : '0'

  return {
    erc20Balance: erc20Balance.replace(',', ''),
    loading,
    refetch
  }
}
