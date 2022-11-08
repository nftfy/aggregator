import { gql } from '@apollo/client'

export interface SpecificItemBuyersVars {
  chainId: number
  rockpoolItemId: string
  limit: number
  offset: number
}

export interface SpecificItemBuyers {
  amount: string
  buyer: string
  fractionsCount: string | null
  id: string
  ownership: string
}

export interface SpecificItemBuyersData {
  buyersCountRockpoolItems: {
    buyersCount: number
  }
  rockpoolItemBuyers: SpecificItemBuyers[]
}

export const SPECIFIC_ITEM_BUYERS_QUERY = gql`
  query RockpoolItemBuyers($chainId: Int!, $rockpoolItemId: String!, $limit: Int, $offset: Int) {
    rockpoolItemBuyers(chainId: $chainId, rockpoolItemId: $rockpoolItemId, limit: $limit, offset: $offset) {
      amount
      buyer
      fractionsCount
      id
      ownership
    }
    buyersCountRockpoolItems(chainId: $chainId, rockpoolItemId: $rockpoolItemId) {
      buyersCount
    }
  }
`
