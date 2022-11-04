import { gql } from '@apollo/client'

export interface Erc721IsValidContractVars {
  address: string
  chainId: number
}

export interface Erc721IsValidContractData {
  isValidERC721: boolean
}

export const IS_VALID_ERC721_QUERY = gql`
  query isValidERC721($address: String!, $chainId: Int!) {
    isValidERC721(address: $address, chainId: $chainId)
  }
`
