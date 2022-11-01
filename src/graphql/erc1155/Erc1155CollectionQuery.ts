import { gql } from '@apollo/client'

export interface Erc1155CollectionVars {
  erc1155Address: string
  chainId: number
}
export interface Erc1155CollectionData {
  erc1155Collection: {
    chainId: number
    collectionAddress: string
    image_url: string
    collectionName: string
    slug: string
    stats?: {
      itemsCount: number
      ownersCount: number
    }
  }
}

export const ERC1155_COLLECTION_QUERY = gql`
  query erc1155Collection($erc1155Address: String!, $chainId: Int!) {
    erc1155Collection(collectionAddress: $erc1155Address, chainId: $chainId) {
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
