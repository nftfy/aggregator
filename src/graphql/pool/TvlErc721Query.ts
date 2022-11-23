import { gql } from '@apollo/client'

export interface TvlErc721QueryVars {
  chainId: number
  poolAddress: string
}

export interface TvlErc721QueryData {
  stakedTvlErc721: string
}

export const GET_POOL_TVL_INFO_QUERY = gql`
  query GetPoolTvlInfo($chainId: Int!, $poolAddress: String!) {
    stakedTvlErc721(chainId: $chainId, poolAddress: $poolAddress)
  }
`
