import { gql } from '@apollo/client'
import { EvmRawTx } from '@appTypes/EvmRawTx'

export interface WithdrawEthTxQueryVars {
  chainId: number
  amount: string
  address: string
  poolAddress: string
}

export interface WithdrawEthTxQueryData {
  withdrawEthTx: EvmRawTx
}

export const WITHDRAW_ETH_TX_QUERY = gql`
  mutation WithdrawEth($chainId: Int!, $address: String!, $poolAddress: String!, $amount: String!) {
    withdrawEthTx(chainId: $chainId, account: $address, poolAddress: $poolAddress, amount: $amount) {
      data
      gas
      gasPrice
      to
      from
    }
  }
`
