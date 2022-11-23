import { gql } from '@apollo/client'
export interface AcquireData {
  acquireData: string
}

export interface AcquireQueryData {
  buyFloorAcquireData: AcquireData
}

export interface AcquireDataQueryVars {
  chainId: number | undefined
  collectionAddress: string | undefined
  tokenId?: string
}

export const ACQUIRE_DATA_QUERY = gql`
  query BuyFloorAcquireData($chainId: Int!, $collectionAddress: String!, $tokenId: String!) {
    buyFloorAcquireData(chainId: $chainId, collectionAddress: $collectionAddress, tokenId: $tokenId) {
      acquireData
    }
  }
`
