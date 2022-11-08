import { StableCoinsEnum } from '../../models/StableCoinsEnum'

interface RewardsConfig {
  contract: {
    erc721Factory: string
  }
}

interface SpecificConfig {
  contract: {
    externalAcquirer: string
    openCollectivePurchase: string
  }
}
export interface AssetERC20 {
  name: string
  symbol: string
  address: string
  decimals: number
}

export interface ChainConfig {
  chainId: number
  name: string
  openSeaUrl: string
  fantasyName: string
  nativeToken: {
    address: string
    decimals: number
    symbol: string
  }
  blockExplorer: string
  stableCoins: {
    [key in StableCoinsEnum]: AssetERC20
  }
  stablecoinAddress: string
  scanAddress: string
  subgraphUrl: string
  hub?: RewardsConfig
  products: {
    specific: SpecificConfig
  }
}
