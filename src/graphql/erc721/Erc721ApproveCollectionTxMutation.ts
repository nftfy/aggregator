import { gql } from '@apollo/client'
import { EvmRawTx } from '../../types/EvmRawTx'

export interface Erc721ApproveCollectionTxQueryVars {
  account: string
  chainId: number
  collectionAddress: string
  poolAddress: string
}

export interface Erc721ApproveCollectionTxQueryData {
  approveErc721CollectionTx: EvmRawTx
}
export const ERC721_APPROVE_COLLECTION = gql`
  mutation ApproveErc721CollectionTx($account: String!, $chainId: Int!, $collectionAddress: String!, $poolAddress: String!) {
    approveErc721CollectionTx(account: $account, chainId: $chainId, collectionAddress: $collectionAddress, poolAddress: $poolAddress) {
      data
      from
      gas
      gasPrice
      to
    }
  }
`
