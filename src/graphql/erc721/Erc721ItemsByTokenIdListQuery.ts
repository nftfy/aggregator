import { gql } from '@apollo/client'
import { Erc721 } from '../../types/Erc721'

export interface Erc721ItemsByTokenIdListQueryVars {
  chainId: number
  contractAddress: string
  tokenIdList: string[]
}

export interface Erc721ItemsByTokenIdListQueryData {
  erc721ItemsByTokenIdList: Erc721[]
}

export const ERC721_ITEMS_BY_TOKEN_ID_LIST_QUERY = gql`
  query Erc721ItemsByTokenIdListQuery($chainId: Int!, $contractAddress: String!, $tokenIdList: [String!]!) {
    erc721ItemsByTokenIdList(chainId: $chainId, contractAddress: $contractAddress, tokenIdList: $tokenIdList) {
      chainId
      tokenId
      address
      ownerAddress
      nftsCount
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
