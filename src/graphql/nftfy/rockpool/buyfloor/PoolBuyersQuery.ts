import { gql } from '@apollo/client'
import { Buyer } from '../SpecificPoolItemBuyer'

export interface PoolBuyersQueryData {
  buyFloorBuyers: Buyer[]
}

export interface PoolBuyersQueryVars {
  chainId: number
  poolId: string
}

export const POOL_BUYERS_QUERY = gql`
  query PoolBuyers($chainId: Int!, $poolId: String!) {
    buyFloorBuyers(chainId: $chainId, id: $poolId) {
      amount
      buyer
      fractionsCount
      ownership
      avatarUrl
      userName
    }
  }
`
