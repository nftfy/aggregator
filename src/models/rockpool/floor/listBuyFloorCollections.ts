import { BuyFloorStatus } from './BuyFloorStatusEnum'

export interface Buyer {
  buyer: string
  amount: string
  fractionsCount: string
  ownership: string
}

export interface ListBuyFloorCollections {
  collectionAddress: string
  collectionName: string
  imageUrl: string
  targetPrice: string
  buyersCount: number
  progress: number
  remainingAmount: string
  status: BuyFloorStatus
}

export interface ListClaimsFloorCollections {
  collectionAddress: string
  collectionName: string
  poolId: string
  lastPrice: string
  roundNumber: string
  buyersCount: number
  fractions: string
  fractionsCount: string
  amount: string
  reservePriceAfterFractionalize: string
  timestamp: number
}

export interface ListFloorPoolsCollections {
  id: string
  roundNumber: number
  fractionsCount: string
  fractions: string
  timestamp: number
  reservePrice: string
  reservePriceAfterFractionalize: string
  buyersCount: number
  buyers: Buyer[]
  target: {
    id: string
    tokenId: string
    tokenURI: string
    contract_type: string | null
    metadata: {
      image: string
      imageFull: string
      instagram: string
      description: string
    }
    collection: {
      id: string
      name: string
      symbol: string
    }
  }
}
