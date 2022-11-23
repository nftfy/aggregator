import { gql } from '@apollo/client'
import { ClaimableRockpoolFractions } from '../../../models/rockpool/SpecificPoolsTypes'

export interface ClaimableRockpoolByFractionsVars {
  chainId: number
  buyer: string
  limit: number
  offset: number
}

export interface ClaimableRockpoolByFractionsData {
  claimableRockpoolFractions: ClaimableRockpoolFractions[]
}

export const CLAIMABLE_ROCKPOOL_BY_FRACTIONS = gql`
  query ClaimableRockpoolFractions($chainId: Int!, $buyer: String!, $limit: Int, $offset: Int) {
    claimableRockpoolFractions(chainId: $chainId, buyer: $buyer, limit: $limit, offset: $offset) {
      buyer
      amount
      fractionsCount
      ownership
      collectionAddress
      collectionName
      tokenId
      imageUrl
      targetPrice
      buyersCount
      fractions
      lastSale
      poolId
    }
  }
`
