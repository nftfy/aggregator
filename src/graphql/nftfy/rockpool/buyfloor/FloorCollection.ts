import { gql } from '@apollo/client'

export interface FloorCollectionList {
  collectionName: string
  collectionSlug: string
  collectionAddress: string
}

export interface FloorCollectionQueryData {
  selectedFloorCollections: FloorCollectionList[]
}

export interface FloorCollectionQueryVars {
  chainId: number
}

export const FLOOR_COLLECTION = gql`
  query SelectedFloorCollections($chainId: Int!) {
    selectedFloorCollections(chainId: $chainId) {
      collectionName
      collectionSlug
      collectionAddress
    }
  }
`
