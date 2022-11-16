import { gql } from '@apollo/client'
export interface ReservePrice {
  reservePrice: string
}

export interface ReservePriceQueryData {
  buyFloorReservePrice: ReservePrice
}

export interface ReservePriceQueryVars {
  chainId: number
  floorPrice: string
  id?: string
}

export const RESERVE_PRICE_QUERY = gql`
  query ReservePrice($chainId: Int!, $id: String, $floorPrice: String!) {
    buyFloorReservePrice(chainId: $chainId, id: $id, floorPrice: $floorPrice) {
      reservePrice
    }
  }
`
