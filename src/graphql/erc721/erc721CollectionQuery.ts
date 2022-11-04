import { gql } from '@apollo/client'

export interface Erc721CollectionVars {
  erc721Address: string
  chainId: number
}
export interface Erc721CollectionData {
  erc721Collection: {
    chainId: number
    collectionAddress: string
    image_url: string
    collectionName: string
    slug: string
    stats: {
      itemsCount: number
      ownersCount: number
    }
  }
}

export const ERC721_COLLECTION = gql`
  query erc721Collection($erc721Address: String!, $chainId: Int!) {
    erc721Collection(collectionAddress: $erc721Address, chainId: $chainId) {
      chainId
      collectionAddress
      image_url
      collectionName
      slug
      stats {
        itemsCount
        ownersCount
      }
    }
  }
`
