import { useQuery } from '@apollo/client'
import { chainConfig } from '../ChainConfig'
import { ERC20_QUOTE, QuoteExchangeData, QuoteExchangeVars } from '../graphql/erc20/Erc20QuoteQuery'

export function useDollarQuotation(chainId: number, amount: string, fromTokenAddress: string, amountFromDecimals: number) {
  const { stablecoinAddress } = chainConfig(chainId)

  const { loading, data, error } = useQuery<QuoteExchangeData, QuoteExchangeVars>(ERC20_QUOTE, {
    variables: {
      amount,
      chainId,
      toTokenAddress: stablecoinAddress,
      fromTokenAddress,
      amountDecimals: amountFromDecimals
    },
    skip: !amount || !stablecoinAddress || !fromTokenAddress || amountFromDecimals === 0
  })

  if (error) {
    throw error
  }

  return {
    loading,
    dollarValue: data?.quoteExchange?.amount,
    error
  }
}
