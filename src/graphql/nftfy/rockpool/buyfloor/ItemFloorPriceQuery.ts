import { gql } from '@apollo/client'

export interface ItemFloorPrice {
  tokenId: string
  image?: string
  floorAskPrice?: number
  targetPrice?: string
}

export interface ItemFloorPriceQueryData {
  itemFloorPrice: ItemFloorPrice
}

export interface ItemFloorPriceQueryVars {
  chainId: number
  collectionAddress: string
}

export const ITEM_FLOOR_PRICE_QUERY = gql`
  query ItemFloorPrice($chainId: Int!, $collectionAddress: String!) {
    itemFloorPrice(chainId: $chainId, contractAddress: $collectionAddress) {
      tokenId
      image
      floorAskPrice
      targetPrice
    }
  }
`
