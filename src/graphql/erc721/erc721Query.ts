import { gql } from '@apollo/client'

export interface Erc721Vars {
  erc721Address: string
  chainId: number
  tokenId: string
}

interface Metadata {
  image: string
  description: string
}

export interface Erc721Data {
  erc721: {
    chainId: number
    address: string
    metadata: Metadata
    name: string
    symbol: string
  }
}

export const ERC721 = gql`
  query erc721($erc721Address: String!, $chainId: Int!, $tokenId: String!) {
    erc721(contractAddress: $erc721Address, chainId: $chainId, tokenId: $tokenId) {
      chainId
      address
      metadata {
        image
        description
      }
      name
      symbol
    }
  }
`
