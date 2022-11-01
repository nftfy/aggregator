import { gql } from '@apollo/client'
import { Erc721 } from '../../types/Erc721'

export interface Erc721TargetByOwnerQueryVars {
  chainId: number
  contractAddress: string
  ownerAddress: string
  limit: number
  offset: number
}

export interface Erc721TargetByOwnerQueryData {
  targetNftByOwner: Erc721[]
}

export const ERC721_TARGET_BY_OWNER_QUERY = gql`
  query TargetNftByOwner($chainId: Int!, $contractAddress: String!, $ownerAddress: String!, $limit: Int, $offset: Int) {
    targetNftByOwner(chainId: $chainId, contractAddress: $contractAddress, ownerAddress: $ownerAddress, limit: $limit, offset: $offset) {
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
        author
        description
        discord
        image
        imageFull
        instagram
        name
        owner
        social_media
        telegram
        totalSupply
        twitter
        web_site_url
      }
    }
  }
`
