import { chainConfig } from '../ChainConfig'
import { networkNameById } from '../services/NetworkService'
import { useRouteParams } from './useRouteParams'

export enum AvailableNetworksName {
  'blockchain' = 'blockchain',
  'ethereum' = 'ethereum',
  'polygon' = 'polygon',
  'binance_smart_chain' = 'binance_smart_chain',
  'avalanche' = 'avalanche',
  'fantom' = 'fantom',
  'rinkeby' = 'rinkeby',
  'mumbai' = 'mumbai',
  'binance_testnet' = 'binance_testnet',
  'avalanche_fuji' = 'avalanche_fuji',
  'fantom_testnet' = 'fantom_testnet',
  'goerli' = 'goerli'
}

export enum AvailableNetworksId {
  ethereum = 1,
  polygon = 137,
  binance_smart_chain = 56,
  avalanche = 43114,
  fantom = 250,
  rinkeby = 4,
  goerli = 5,
  mumbai = 80001,
  binance_testnet = 97,
  avalanche_fuji = 43113,
  fantom_testnet = 4002
}

export const useNetworkFilter = () => {
  const networks = [
    {
      id: AvailableNetworksId.ethereum,
      name: chainConfig(AvailableNetworksId.ethereum).fantasyName,
      image: AvailableNetworksName.ethereum,
      active: true
    }
  ]

  const testnetNetworks = [
    {
      id: AvailableNetworksId.goerli,
      name: chainConfig(AvailableNetworksId.goerli).fantasyName,
      image: AvailableNetworksName.goerli,
      active: true
    },
    {
      id: AvailableNetworksId.mumbai,
      name: chainConfig(AvailableNetworksId.mumbai).fantasyName,
      image: AvailableNetworksName.mumbai,
      active: true
    }
  ]
  const { setItem } = useRouteParams()
  const handleFilterRoute = (id: AvailableNetworksId) => {
    const translateNetwork = networkNameById(Number(id))
    setItem('network', String(translateNetwork))
  }

  return { networks, testnetNetworks, handleFilterRoute }
}
