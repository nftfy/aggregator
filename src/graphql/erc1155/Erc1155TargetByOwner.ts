import { gql } from '@apollo/client'
import { Metadata } from '../../types/Erc721'

export interface Erc1155 {
  chainId: number
  tokenId: string
  address: string
  amount?: string
  ownerAddress?: string
  name?: string
  contract_type?: string
  metadata?: Metadata
}

export interface Erc1155TargetByOwnerQueryVars {
  chainId: number
  contractAddress: string
  ownerAddress: string
  limit: number
  offset: number
}

export interface Erc1155TargetByOwnerQueryData {
  targetNftByOwner: Erc1155[]
}

export const ERC1155_TARGET_BY_OWNER_QUERY = gql`
  query TargetNftByOwner($chainId: Int!, $contractAddress: String!, $ownerAddress: String!, $limit: Int, $offset: Int) {
    targetNftByOwner(chainId: $chainId, contractAddress: $contractAddress, ownerAddress: $ownerAddress, limit: $limit, offset: $offset) {
      chainId
      tokenId
      address
      ownerAddress
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
