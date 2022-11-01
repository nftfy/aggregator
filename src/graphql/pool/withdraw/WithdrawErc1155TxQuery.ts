import { gql } from '@apollo/client'
import { EvmRawTx } from '@appTypes/EvmRawTx'

export interface WithdrawErc1155TxQueryVars {
  chainId: number
  tokenIdList: string[]
  amountPerId: string[]
  address: string
  poolAddress: string
}

export interface WithdrawErc1155TxQueryData {
  withdrawErc1155Tx: EvmRawTx
}

export const WITHDRAW_ERC1155_TX_QUERY = gql`
  mutation WithdrawErc1155($chainId: Int!, $address: String!, $poolAddress: String!, $tokenIdList: [String!]!, $amountPerId: [String!]!) {
    withdrawErc1155Tx(
      chainId: $chainId
      account: $address
      poolAddress: $poolAddress
      tokenIdList: $tokenIdList
      amountPerId: $amountPerId
    ) {
      data
      gas
      gasPrice
      to
      from
    }
  }
`
