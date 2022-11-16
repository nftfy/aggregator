import { gql } from '@apollo/client'
import { PoolItemDetail } from '../../../../models/rockpool/floor/PoolItemDetail'

export interface PoolIdQueryData {
  poolId: PoolItemDetail
}

export interface PoolIdQueryVars {
  chainId: number
  paymentAddress: string
  collectionAddress: string
}

export const POOL_ID_QUERY = gql`
  query PoolId($chainId: Int!, $paymentAddress: String!, $collectionAddress: String!) {
    poolId(chainId: $chainId, paymentAddress: $paymentAddress, collectionAddress: $collectionAddress) {
      id
      roundNumber
      fee
      fractions
      fractionsCount
      targetPrice
      targetPriceNet
      paymentToken {
        id
        name
        symbol
        decimals
      }
      reservePrice
      seller
      status
      description
      name
      symbol
      timestamp
    }
  }
`
