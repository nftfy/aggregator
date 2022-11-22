import { gql } from '@apollo/client'
import { ListBuyFloorCollections } from '../../../../models/rockpool/floor/listBuyFloorCollections'

export interface ListBuyFloorCollectionsQueryData {
  listBuyFloorCollectionsByAddress: ListBuyFloorCollections[]
}

export interface ListBuyFloorCollectionsQueryVars {
  chainId: number
  creator: string
  collectionAddress: string
}

export const LIST_BUY_FLOOR_COLLECTIONS_BY_ADDRESS_QUERY = gql`
  query listBuyFloorCollectionsByAddress($chainId: Int!, $creator: String!, $collectionAddress: String!) {
    listBuyFloorCollectionsByAddress(chainId: $chainId, creator: $creator, collectionAddress: $collectionAddress) {
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
