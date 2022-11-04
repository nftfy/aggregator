import { gql } from '@apollo/client'
import { Erc1155 } from '@graphql/erc1155/Erc1155TargetByOwner'

export interface Erc1155ItemsByTokenIdListQueryVars {
  chainId: number
  contractAddress: string
  tokenIdList: string[]
}

export interface Erc1155ItemsByTokenIdListQueryData {
  erc1155ItemsByTokenIdList: Erc1155[]
}

export const ERC1155_ITEMS_BY_TOKEN_ID_LIST_QUERY = gql`
  query Erc1155ItemsByTokenIdListQuery($chainId: Int!, $contractAddress: String!, $tokenIdList: [String!]!) {
    erc1155ItemsByTokenIdList(chainId: $chainId, contractAddress: $contractAddress, tokenIdList: $tokenIdList) {
      chainId
      tokenId
      address
      amount
      name
      symbol
      contract_type
      metadata {
        animationType
        animation_url
        description
        image
      }
    }
  }
`
