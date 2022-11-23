import { gql } from '@apollo/client'
import { BuyFloorStatus } from '../../../../models/rockpool/floor/BuyFloorStatusEnum'

export interface PoolProgress {
  status?: BuyFloorStatus
  target?: string
  amount?: string
  progress?: number
  remainingAmount?: string
}

export interface PoolProgressDetailsQueryData {
  poolProgress: PoolProgress
}

export interface PoolProgressDetailsQueryVars {
  chainId: number
  poolId: string
}

export const POOL_PROGRESS_DETAILS_QUERY = gql`
  query PoolProgressDetails($chainId: Int!, $poolId: String!) {
    poolProgress(chainId: $chainId, id: $poolId) {
      status
      target
      amount
      progress
      remainingAmount
    }
  }
`
