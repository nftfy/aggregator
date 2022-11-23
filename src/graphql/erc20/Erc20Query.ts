import { gql } from '@apollo/client'
import { Erc20 } from '../../models/Erc20'

export interface Erc20Vars {
  address: string
  chainId: number
}

export interface Erc20Data {
  erc20: Erc20
}

export const ERC20 = gql`
  query erc20($address: String!, $chainId: Int!) {
    erc20(contractAddress: $address, chainId: $chainId) {
      chainId
      contractAddress
      image
      decimals
      name
      symbol
    }
  }
`
