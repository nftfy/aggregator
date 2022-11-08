import { gql } from '@apollo/client'

export interface NativeBalanceQueryData {
  nativeBalance: string
}

export interface NativeBalanceQueryVars {
  address: string
  chainId: number
}

export const NATIVE_BALANCE_QUERY = gql`
  query NativeBalance($address: String!, $chainId: Int!) {
    nativeBalance(address: $address, chainId: $chainId)
  }
`
