import { gql } from '@apollo/client'
import { RewardPool } from '../../types/pool/RewardPool'

export interface StakingPoolVars {
  chainId: number
  poolAddress: string
}

export interface StakingPoolData {
  stakingPool: RewardPool
}

export const STAKING_POOL_QUERY = gql`
  query StakingPool($chainId: Int!, $poolAddress: String!) {
    stakingPool(chainId: $chainId, poolAddress: $poolAddress) {
      id
      address
      userCount
      amount
      hasStake
      offchain {
        detailsImage
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
