import { gql } from '@apollo/client'

export interface IsApprovedForAllErc1155QueryVars {
  chainId: number
  collectionAddress: string
  spender: string
  ownerAccount: string
}

export interface IsApprovedForAllErc1155QueryData {
  isApprovedForAllErc1155: boolean
}
export const IS_APPROVED_FOR_ALL_ERC1155_QUERY = gql`
  query isApprovedForAllErc1155($chainId: Int!, $collectionAddress: String!, $spender: String!, $ownerAccount: String!) {
    isApprovedForAllErc1155(chainId: $chainId, collectionAddress: $collectionAddress, spender: $spender, ownerAccount: $ownerAccount)
  }
`
