import { gql } from '@apollo/client'

export interface IsApprovedForAllErc721QueryVars {
  chainId: number
  collectionAddress: string
  spender: string
  ownerAccount: string
}

export interface IsApprovedForAllErc721QueryData {
  isApprovedForAllErc721: boolean
}
export const IS_APPROVED_FOR_ALL_ERC721_QUERY = gql`
  query isApprovedForAllErc721($chainId: Int!, $collectionAddress: String!, $spender: String!, $ownerAccount: String!) {
    isApprovedForAllErc721(chainId: $chainId, collectionAddress: $collectionAddress, spender: $spender, ownerAccount: $ownerAccount)
  }
`
