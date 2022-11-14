import { gql } from '@apollo/client'

export interface TransactionCheckUnlockErc20QueryVars {
  account: string
  chainId: number
  erc20Address: string
  spender: string
}

export interface TransactionCheckUnlockErc20QueryData {
  allowanceErc20: string
}

export const TRANSACTION_CHECK_UNLOCK_ERC20 = gql`
  query allowanceErc20($account: String!, $chainId: Int!, $erc20Address: String!, $spender: String!) {
    allowanceErc20(account: $account, chainId: $chainId, erc20Address: $erc20Address, spender: $spender)
  }
`
