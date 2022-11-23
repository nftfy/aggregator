import { gql } from '@apollo/client'

interface Collection {
  address: string
  image: string
  name: string
}

export interface CollectionsFilterData {
  collectionsFilter: Collection[]
}

export interface CollectionsFilterVars {
  chainId: number
}

export const COLLECTIONS_FILTER_QUERY = gql`
  query CollectionsFilter($chainId: Int!) {
    collectionsFilter(chainId: $chainId) {
      address
      image
      name
    }
  }
`
