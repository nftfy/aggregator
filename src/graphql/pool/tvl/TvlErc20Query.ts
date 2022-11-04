import { gql } from '@apollo/client'

export interface TvlErc20QueryVars {
  chainId: number
  poolAddress: string
}

export interface TvlErc20QueryData {
  stakedTvlErc20: string
}

export const STAKED_TVL_ERC_20_QUERY = gql`
  query stakedTvlErc20($chainId: Int!, $poolAddress: String!) {
    stakedTvlErc20(chainId: $chainId, poolAddress: $poolAddress)
  }
`
