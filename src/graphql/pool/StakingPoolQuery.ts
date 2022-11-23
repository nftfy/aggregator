import { gql } from '@apollo/client'
import { RewardPool } from '../../types/pool/RewardPool'

export interface StakingPoolVars {
  chainId?: number
  poolAddress?: string
  accountAddress?: string
}

export interface StakingPoolData {
  stakingPool: RewardPool
}

export const STAKING_POOL_QUERY = gql`
  query StakingPool($chainId: Int!, $poolAddress: String!, $accountAddress: String) {
    stakingPool(chainId: $chainId, poolAddress: $poolAddress, accountAddress: $accountAddress) {
      id
      address
      userCount
      amount
      hasStake
      offchain {
        description
        coverImage
        detailsImage
        discord
        name
        sponsor {
          image
          name
          verified
        }
        earnTokenImage
        getMoreTokenUrl

        stakeTokenImage
        website
        telegram
        twitter
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
