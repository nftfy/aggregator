import { gql } from '@apollo/client'
import { QuoteExchange } from '../../types/models/QuoteExchange'

export interface ExchangeQuotaQueryData {
  quoteExchange: QuoteExchange
}

export interface ExchangeQuoteQueryVars {
  fromTokenAddress: string
  toTokenAddress: string
  amount: string
  amountDecimals: number
  chainId: number
}

export const EXCHANGE_QUOTE_QUERY = gql`
  query QuoteErc20Liquidity($fromTokenAddress: String!, $toTokenAddress: String!, $amount: String!, $amountDecimals: Int!, $chainId: Int!) {
    quoteExchange(
      fromTokenAddress: $fromTokenAddress
      toTokenAddress: $toTokenAddress
      amount: $amount
      amountDecimals: $amountDecimals
      chainId: $chainId
    ) {
      amount
    }
  }
`
