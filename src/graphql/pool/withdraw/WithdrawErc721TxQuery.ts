import { gql } from '@apollo/client'
import { EvmRawTx } from '@appTypes/EvmRawTx'

export interface WithdrawErc721TxQueryVars {
  chainId: number
  tokenIdList: string[]
  address: string
  poolAddress: string
}

export interface WithdrawErc721TxQueryData {
  withdrawErc721Tx: EvmRawTx
}

export const WITHDRAW_ERC721_TX_QUERY = gql`
  mutation WithdrawErc721($chainId: Int!, $address: String!, $poolAddress: String!, $tokenIdList: [String!]!) {
    withdrawErc721Tx(chainId: $chainId, account: $address, poolAddress: $poolAddress, tokenIdList: $tokenIdList) {
      data
      gas
      gasPrice
      to
      from
    }
  }
`
