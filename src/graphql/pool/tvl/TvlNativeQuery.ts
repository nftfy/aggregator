import { gql } from '@apollo/client'

export interface TvlNativeQueryVars {
  chainId: number
  poolAddress: string
}

export interface TvlNativeQueryData {
  stakedTvlNative: string
}

export const STAKED_TVL_NATIVE_QUERY = gql`
  query GetPoolTvlNativeInfo($chainId: Int!, $poolAddress: String!) {
    stakedTvlNative(chainId: $chainId, poolAddress: $poolAddress)
  }
`
