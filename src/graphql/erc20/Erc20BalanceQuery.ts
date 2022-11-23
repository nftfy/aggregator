import { gql } from '@apollo/client'

export interface Erc20Balance {
  accountAddress: string
  chainId: number
  symbol: string
  balance: string
  erc20Address: string
  decimals: string
}

export interface Erc20BalanceQueryData {
  erc20Balance: Erc20Balance
}

export interface Erc20BalanceQueryVars {
  chainId: number
  erc20Address: string
  accountAddress: string
}

export const ERC20_BALANCE = gql`
  query Erc20Balance($chainId: Int!, $erc20Address: String!, $accountAddress: String!) {
    erc20Balance(accountAddress: $accountAddress, chainId: $chainId, erc20Address: $erc20Address) {
      accountAddress
      chainId
      symbol
      balance
      erc20Address
      decimals
    }
  }
`
