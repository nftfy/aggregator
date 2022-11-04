import { gql } from '@apollo/client'
import { EvmRawTx } from '../../types/EvmRawTx'

export interface Erc1155ApproveCollectionTxQueryVars {
  ownerAccount: string
  chainId: number
  collectionAddress: string
  operator: string
}

export interface Erc1155ApproveCollectionTxQueryData {
  approveErc1155CollectionTx: EvmRawTx
}
export const ERC1155_APPROVE_COLLECTION = gql`
  mutation ApproveErc1155CollectionTx($ownerAccount: String!, $chainId: Int!, $collectionAddress: String!, $operator: String!) {
    approveErc1155CollectionTx(ownerAccount: $ownerAccount, chainId: $chainId, collectionAddress: $collectionAddress, operator: $operator) {
      data
      from
      gas
      gasPrice
      to
    }
  }
`
