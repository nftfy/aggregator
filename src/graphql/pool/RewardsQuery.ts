import { gql } from '@apollo/client'

export interface RewardsQueryData {
  rewards: string
}

export interface RewardsQueryVars {
  accountAddress: string
  chainId: number
  poolAddress: string
  rewardToken: string
  rewardTokenDecimals: number
}

export const REWARDS_TOKEN_QUERY = gql`
  query RewardsToken($accountAddress: String!, $chainId: Int!, $poolAddress: String!, $rewardToken: String!, $rewardTokenDecimals: Int!) {
    rewards(
      accountAddress: $accountAddress
      chainId: $chainId
      poolAddress: $poolAddress
      rewardToken: $rewardToken
      rewardTokenDecimals: $rewardTokenDecimals
    )
  }
`
