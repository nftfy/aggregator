import { gql } from '@apollo/client'

export interface SpecificItemBuyerVars {
  accountAddress: string
  chainId: number
  rockpoolItemId: string
}

export interface Buyer {
  amount: string
  buyer: string
  fractionsCount: string | null
  id: string
  ownership: string
}

export interface SpecificItemBuyerData {
  rockpoolItemBuyer: Buyer
}

export const SPECIFIC_ITEM_BUYER_QUERY = gql`
  query RockpoolItemBuyer($accountAddress: String!, $chainId: Int!, $rockpoolItemId: String!) {
    rockpoolItemBuyer(accountAddress: $accountAddress, chainId: $chainId, rockpoolItemId: $rockpoolItemId) {
      amount
      buyer
      fractionsCount
      id
      ownership
    }
  }
`
