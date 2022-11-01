interface Erc721Property {
  type: string
  description: string
}

interface Erc721Properties {
  name: Erc721Property
  created_at: Erc721Property
  description: Erc721Property
  total_supply: Erc721Property
  preview_media_file: Erc721Property
  preview_media_file_type: Erc721Property
  preview_media_file2: Erc721Property
  preview_media_file2_type: Erc721Property
  preview_media_file_type2: Erc721Property
}

interface Erc721Attribute {
  trait_type: string
  value: string
}

interface AssetContract {
  name: string
  schema_name: string
}

export interface Metadata {
  name?: string
  owner?: string
  image?: string
  imageFull?: string
  description?: string
  animationType?: string
  animation_url?: string
  author?: string
  totalSupply?: string
  web_site_url?: string
  social_media?: string
  twitter?: string
  telegram?: string
  discord?: string
  instagram?: string
  asset_contract?: AssetContract
  attributes?: Erc721Attribute[]
  properties?: Erc721Properties
}

export interface Erc721 {
  chainId: number
  address: string
  metadata: Metadata
  name: string
  tokenId: string
  symbol: string
  ownerAddress?: string
}

export interface Erc721Collection {
  chainId: number
  collectionAddress: string
  image_url: string
  collectionName: string
  slug: string
}
