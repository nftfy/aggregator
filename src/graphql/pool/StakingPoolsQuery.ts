import { gql } from '@apollo/client'
import { FilterType, RewardPool } from '../../types/pool/RewardPool'

export interface StakingPoolsVars {
  chainId: number
  accountAddress?: string
  limit: number
  offset: number
  filterBy: FilterType | string
  tokenList?: string[]
  stakedOnly?: boolean
}

export interface StakingPoolsData {
  stakingPools: RewardPool[]
}

export const STAKING_POOLS_QUERY = gql`
  query StakingPools(
    $chainId: Int!
    $limit: Int!
    $offset: Int!
    $accountAddress: String
    $filterBy: String!
    $tokenList: [String!]
    $stakedOnly: Boolean
  ) {
    stakingPools(
      chainId: $chainId
      limit: $limit
      offset: $offset
      accountAddress: $accountAddress
      filterBy: $filterBy
      tokenList: $tokenList
      stakedOnly: $stakedOnly
    ) {
      id
      address
      userCount
      amount
      hasStake
      offchain {
        coverImage
        earnTokenImage
        stakeTokenImage
        sponsor {
          image
          name
          verified
        }
      }
      items {
        account {
          id
        }
        tokenId
        amount
      }
      token {
        decimals
        id
        name
        symbol
        native
      }
      rewards {
        rewardPerSec
        dailyRewards
        progress
        expirationInfo {
          days
          hours
          minutes
          seconds
        }
        token {
          id
          name
          symbol
          native
          decimals
        }
      }
      type
    }
  }
`
