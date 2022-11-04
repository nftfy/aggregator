import { gql } from '@apollo/client'

export interface Erc1155CollectionVars {
  erc721Address: string
  chainId: number
}
export interface Erc1155CollectionData {
  erc1155Collection: {
    chainId: number
    collectionAddress: string
    image_url: string
    collectionName: string
    slug: string
  }
}

export const ERC1155_COLLECTION = gql`
  query erc1155Collection($erc721Address: String!, $chainId: Int!) {
    erc1155Collection(collectionAddress: $erc721Address, chainId: $chainId) {
      chainId
      collectionAddress
      image_url
      collectionName
      slug
    }
  }
`
