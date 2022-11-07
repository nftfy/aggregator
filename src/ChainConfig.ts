import { ChainConfig } from './types/config/ChainConfig'

const chainsConfig: ChainConfig[] = [
  {
    chainId: 1,
    name: 'Ethereum',
    nativeToken: {
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      symbol: 'ETH'
    },
    fantasyName: 'Ethereum',
    stablecoinAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
    scanAddress: 'https://etherscan.io',
    subgraphUrl: 'https://rinkeby.api.thegraph.com/subgraphs/name/rinkeby/crowd-pad'
  },
  {
    chainId: 5,
    name: 'Goerli',
    nativeToken: {
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      symbol: 'ETH'
    },
    fantasyName: 'Goerli',
    stablecoinAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
    scanAddress: 'https://goerli.etherscan.io/',
    subgraphUrl: 'https://api.thegraph.com/subgraphs/id/Qmb2WL3s4gviNc6mvGzqUHHho1JuzicgvJnACA5rzb911k',
    hub: {
      contract: {
        erc721Factory: '0x6b93fd2A7174FAA28265dC1d85ee603c3d7C36e8'
      }
    }
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
    subgraphUrl: 'https://api.thegraph.com/subgraphs/id/QmTxJpBNBGAct6PZLcdF6ccyzHgeuH3cpDQZ3zF1jdWRht'
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
