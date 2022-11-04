import { gql } from '@apollo/client'

export interface TvlErc721QueryVars {
  chainId: number
  poolAddress: string
}

export interface TvlErc721QueryData {
  stakedTvlErc721: string
}

export const STAKED_TVL_ERC721_QUERY = gql`
  query stakedTvlErc721($chainId: Int!, $poolAddress: String!) {
    stakedTvlErc721(chainId: $chainId, poolAddress: $poolAddress)
  }
`
