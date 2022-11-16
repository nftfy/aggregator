import { gql } from '@apollo/client'
import { BuyFloorStatus } from '../../types/models/enums/BuyFloorStatusEnum'
import { ListFloorPoolsCollections } from '../../types/models/listBuyFloorCollections'

export interface ListFloorPoolsCollectionsQueryData {
  listingPools: ListFloorPoolsCollections[]
}

export interface ListFloorPoolsCollectionsQueryVars {
  orderBy: string
  orderDirection: 'asc' | 'desc'
  offset?: number
  limit: number
  chainId: number
  collectionAddress: string
  paymentTokenAddress: string
  status?: BuyFloorStatus
  buyerAccount?: string
}

export const LIST_FLOOR_POOLS_COLLECTIONS = gql`
  query listingPools(
    $chainId: Int!
    $collectionAddress: String!
    $paymentTokenAddress: String!
    $status: BuyFloorStatus!
    $buyerAccount: String
    $offset: Int!
    $limit: Int!
    $orderDirection: OrderDirection!
    $orderBy: PoolItemOrderBy!
  ) {
    listingPools(
      orderBy: $orderBy
      orderDirection: $orderDirection
      offset: $offset
      limit: $limit
      chainId: $chainId
      collectionAddress: $collectionAddress
      paymentTokenAddress: $paymentTokenAddress
      status: $status
      buyerAccount: $buyerAccount
    ) {
      id
      seller
      creator
      roundNumber
      reservePrice
      reservePriceAfterFractionalize
      timestamp
      fee
      fractions
      fractionsCount
      status
      buyersCount
      buyers {
        buyer
        amount
        fractionsCount
        ownership
      }
      paymentToken {
        id
        symbol
        decimals
      }
      target {
        id
        tokenId
        tokenURI
        contract_type
        metadata {
          image
          imageFull
          instagram
          description
        }
        collection {
          id
          name
          symbol
        }
      }
    }
  }
`
