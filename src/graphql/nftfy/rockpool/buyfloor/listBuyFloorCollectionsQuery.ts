import { gql } from '@apollo/client'
import { ListBuyFloorCollections } from '../../types/models/listBuyFloorCollections'

export interface ListBuyFloorCollectionsQueryData {
  listBuyFloorCollections: ListBuyFloorCollections[]
}

export interface ListBuyFloorCollectionsQueryVars {
  chainId: number
  creator: string
}

export const LIST_BUY_FLOOR_COLLECTIONS_QUERY = gql`
  query listBuyFloorCollections($chainId: Int!, $creator: String!) {
    listBuyFloorCollections(chainId: $chainId, creator: $creator) {
      collectionAddress
      collectionName
      imageUrl
      targetPrice
      buyersCount
      progress
      remainingAmount
      status
    }
  }
`
