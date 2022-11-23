import { gql } from '@apollo/client'

export interface TvlErc1155QueryVars {
  chainId: number
  poolAddress: string
}

export interface TvlErc1155QueryData {
  stakedTvlErc1155: string
}

export const GET_POOL_ERC1155_TVL_INFO_QUERY = gql`
  query stakedTvlErc1155($chainId: Int!, $poolAddress: String!) {
    stakedTvlErc1155(chainId: $chainId, poolAddress: $poolAddress)
  }
`
