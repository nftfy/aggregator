import { ChainConfig } from './types/config/ChainConfig'

export enum EthereumTestNetworks {
  rinkeby = 4,
  goerli = 5
}

export enum SupportedNetworks {
  ethereum = 1,
  rinkeby = 4,
  goerli = 5,
  'binance_smart_chain' = 56,
  'binance_testnet' = 97,
  polygon = 137,
  mumbai = 80001
}

const chainsConfig: ChainConfig[] = [
  {
    chainId: 1,
    name: 'Ethereum',
    nativeToken: {
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      symbol: 'ETH'
    },
    openSeaUrl: 'https://opensea.io/',
    stableCoins: {
      USDC: {
        name: 'USD Coin',
        symbol: 'USDC',
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        decimals: 6
      }
    },
    fantasyName: 'Ethereum',
    stablecoinAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
    scanAddress: 'https://etherscan.io',
    subgraphUrl: 'https://rinkeby.api.thegraph.com/subgraphs/name/rinkeby/crowd-pad',
    products: {
      specific: {
        contract: {
          externalAcquirer: '0x8eD69629B8fA69eEf1b019a3a427C08DC24Dd35f',
          openCollectivePurchase: '0x1afcCa7a8656A1BCC5A3827B97A183C4Cd1740c2'
        },
        subgraph: ''
      }
    },
    blockExplorer: 'https://etherscan.io/'
  },
  {
    chainId: 5,
    name: 'Goerli',
    nativeToken: {
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      symbol: 'ETH'
    },
    openSeaUrl: 'https://testnets.opensea.io/',
    fantasyName: 'Goerli',
    stablecoinAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
    scanAddress: 'https://goerli.etherscan.io/',
    subgraphUrl: 'https://api.thegraph.com/subgraphs/id/Qmb2WL3s4gviNc6mvGzqUHHho1JuzicgvJnACA5rzb911k',
    hub: {
      contract: {
        erc721Factory: '0x6b93fd2A7174FAA28265dC1d85ee603c3d7C36e8'
      }
    },
    products: {
      specific: {
        contract: {
          externalAcquirer: '0x8eD69629B8fA69eEf1b019a3a427C08DC24Dd35f',
          openCollectivePurchase: '0x1afcCa7a8656A1BCC5A3827B97A183C4Cd1740c2'
        },
        subgraph: 'https://api.thegraph.com/subgraphs/id/QmcCdhq4ADYQApYW1YcaYv5u5HoPwNxxNGcihFFLuM466y'
      }
    },
    stableCoins: {
      USDC: {
        name: 'USD Coin',
        symbol: 'USDC',
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        decimals: 6
      }
    },
    blockExplorer: 'https://goerli.etherscan.io/'
  },
  {
    chainId: 80001,
    name: 'Polygon Testnet',
    fantasyName: 'Mumbai',
    nativeToken: {
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      symbol: 'MATIC'
    },
    stablecoinAddress: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
    scanAddress: 'https://mumbai.polygonscan.com/',
    subgraphUrl: 'https://api.thegraph.com/subgraphs/id/QmTxJpBNBGAct6PZLcdF6ccyzHgeuH3cpDQZ3zF1jdWRht',
    products: {
      specific: {
        contract: {
          externalAcquirer: '',
          openCollectivePurchase: ''
        },
        subgraph: ''
      }
    },
    stableCoins: {
      USDC: {
        name: 'USD Coin',
        symbol: 'USDC',
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        decimals: 6
      }
    },
    openSeaUrl: '',
    blockExplorer: 'https://mumbai.polygonscan.com/'
  }
]

export const chainConfig = (id: number): ChainConfig => {
  const config = chainsConfig.find(chain => chain.chainId === id)

  if (!config) {
    // eslint-disable-next-line no-console
    console.error('No Config')
    return chainsConfig[0]
  }

  return config
}
