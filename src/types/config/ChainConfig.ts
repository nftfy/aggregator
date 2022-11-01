interface RewardsConfig {
  contract: {
    erc721Factory: string
  }
}

export interface ChainConfig {
  chainId: number
  name: string
  fantasyName: string
  nativeToken: {
    address: string
    decimals: number
    symbol: string
  }
  stablecoinAddress: string
  scanAddress: string
  subgraphUrl: string
  hub?: RewardsConfig
}
