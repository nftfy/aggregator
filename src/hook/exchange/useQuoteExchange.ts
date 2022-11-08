import { useCallback, useEffect, useState } from 'react'
import { chainConfig, SupportedNetworks } from '../../ChainConfig'
import { nftfyClient } from '../../graphql/Client'
import { ExchangeQuotaQueryData, ExchangeQuoteQueryVars, EXCHANGE_QUOTE_QUERY } from '../../graphql/nftfy/ExchangeQuoteQuery'
import { StableCoinsEnum } from '../../models/StableCoinsEnum'
import { checkEthereumTestNet, formatToLocaleString } from '../../services/UtilService'

interface UseExchangeQuoteProps {
  amount?: string
  chainId: number
}

export const useExchangeQuote = ({ amount, chainId }: UseExchangeQuoteProps) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [quote, setQuote] = useState<string>('0')

  const fetchExchangeQuote = useCallback(async () => {
    try {
      if (!amount?.length) {
        return
      }

      const id = checkEthereumTestNet(chainId) ? SupportedNetworks.ethereum : chainId
      const config = chainConfig(id)
      const { decimals: nativeTokenDecimals, address: nativeTokenAddress } = config.nativeToken

      const tokenToComparePriceAddress = config.stableCoins[StableCoinsEnum.USDC].address

      if (!tokenToComparePriceAddress) {
        setError(new Error('error'))
        setLoading(false)
        return
      }

      const { error: graphqlError, data } = await nftfyClient.query<ExchangeQuotaQueryData, ExchangeQuoteQueryVars>({
        query: EXCHANGE_QUOTE_QUERY,
        variables: {
          chainId: id,
          amount,
          fromTokenAddress: nativeTokenAddress,
          amountDecimals: nativeTokenDecimals,
          toTokenAddress: tokenToComparePriceAddress
        }
      })

      if (graphqlError) {
        setError(graphqlError)
        setLoading(false)
        return
      }

      if (!data || !data.quoteExchange.amount) {
        setLoading(false)
        return
      }

      setQuote(data.quoteExchange.amount)
      setLoading(false)
    } catch (e) {
      setError(new Error('error'))
      setLoading(false)
    }
  }, [chainId, amount])

  useEffect(() => {
    if (!amount || !chainId) return
    fetchExchangeQuote()
  }, [amount, chainId, fetchExchangeQuote])

  return {
    loading,
    error,
    priceDollar: formatToLocaleString(quote, 2, 2)
  }
}
