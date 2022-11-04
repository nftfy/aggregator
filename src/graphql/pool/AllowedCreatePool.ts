import { gql } from '@apollo/client'

export interface AllowedCreatePoolQueryVar {
  walletAddress: string
}

export interface AllowedCreatePoolQueryData {
  isAllowedWallet: boolean
}

export const ALLOWED_CREATE_POOL_QUERY = gql`
  query GetAllowedCreatePool($walletAddress: String!) {
    isAllowedWallet(walletAddress: $walletAddress)
  }
`
