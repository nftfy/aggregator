export interface Erc721CollectionStats {
  itemsCount?: number
  ownersCount?: number
  floorPrice?: number
  volumeTraded?: number
}

export interface Erc721Collection {
  chainId: number
  collectionAddress: string
  slug?: string
  symbol?: string
  verified: boolean
  creator?: string
  collectionName?: string
  description?: string
  website?: string
  discord?: string
  instagram?: string
  telegram?: string
  twitter?: string
  image_url?: string
  banner_url?: string
  stats?: Erc721CollectionStats
}
