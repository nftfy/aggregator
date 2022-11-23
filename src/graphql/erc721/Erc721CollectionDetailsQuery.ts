import { gql } from '@apollo/client'
import { Erc721Collection } from '../../models/rockpool/floor/Erc721Collection'
import { TokenTypeEnum } from '../../models/TokenTypeEnum'

export interface Erc721CollectionDetailsQueryData {
  erc721Collection: Erc721Collection
  tokenImage: TokenImage
}

export interface TokenImage {
  logo?: string
  cover?: string
}

export interface Erc721CollectionDetailsQueryVars {
  chainId: number
  collectionAddress: string
  type: TokenTypeEnum
}

export const ERC721_COLLECTION_DETAILS_QUERY = gql`
  query Erc721CollectionDetails($chainId: Int!, $collectionAddress: String!, $type: TokenTypeEnum!) {
    erc721Collection(chainId: $chainId, collectionAddress: $collectionAddress) {
      banner_url
      slug
      symbol
      collectionAddress
      collectionName
      stats {
        volumeTraded
        ownersCount
        itemsCount
        floorPrice
      }
      instagram
      image_url
      discord
      description
      creator
      chainId
      website
      verified
      twitter
      telegram
    }

    tokenImage(address: $collectionAddress, chainId: $chainId, type: $type) {
      cover
      logo
    }
  }
`
