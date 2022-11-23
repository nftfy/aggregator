import { BuyFloorStatus } from './BuyFloorStatusEnum'

export interface Buyer {
  amount: string
  buyer: string
  fractionsCount: string
  ownership: string
  userName?: string
  avatarUrl?: string
}

export interface PoolItemDetail {
  id?: string
  name?: string
  roundNumber?: number
  chainId?: number
  amount?: string
  symbol?: string
  fee?: string
  seller?: string
  buyers?: Buyer[]
  status?: BuyFloorStatus
  timestamp?: string
  boxCount?: number
  buyersCount?: number | null
  paymentToken: PaymentToken
}

export interface PaymentToken {
  id: string
  name?: string
  symbol: string
  decimals: number
}
