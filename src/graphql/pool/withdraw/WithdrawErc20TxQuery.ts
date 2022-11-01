import { gql } from '@apollo/client'
import { EvmRawTx } from '@appTypes/EvmRawTx'

export interface WithdrawErc20TxQueryVars {
  chainId: number
  decimals: number
  amount: string
  address: string
  poolAddress: string
}

export interface WithdrawErc20TxQueryData {
  withdrawErc20Tx: EvmRawTx
}

export const WITHDRAW_ERC20_TX_QUERY = gql`
  mutation WithdrawErc20($chainId: Int!, $decimals: Int!, $address: String!, $poolAddress: String!, $amount: String!) {
    withdrawErc20Tx(chainId: $chainId, account: $address, poolAddress: $poolAddress, amount: $amount, decimals: $decimals) {
      data
      gas
      gasPrice
      to
      from
    }
  }
`
