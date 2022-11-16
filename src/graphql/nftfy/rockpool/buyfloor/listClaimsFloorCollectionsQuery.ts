import { gql } from '@apollo/client'
import { ListClaimsFloorCollections } from '../../types/models/listBuyFloorCollections'

export interface ListClaimsFloorCollectionsQueryData {
  claimableFloorFractions: ListClaimsFloorCollections[]
}

export interface ListClaimsFloorCollectionsQueryVars {
  chainId: number
  address: string
}

export const LIST_CLAIMS_FLOOR_COLLECTIONS_QUERY = gql`
  query claimableFloorFractions($chainId: Int!, $address: String!) @client {
    claimableFloorFractions(chainId: $chainId, address: $address) {
      collectionAddress
      collectionName
      poolId
      lastPrice
      fractions
      roundNumber
      buyersCount
      fractionsCount
      amount
      reservePriceAfterFractionalize
      timestamp
    }
  }
`
