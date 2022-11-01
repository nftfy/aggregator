import { NetworksId, NetworksName } from '../types/config/Network'

export const networkIdByName = (network: string) => {
  switch (network) {
    case NetworksName.ethereum:
      return NetworksId.ethereum
    case NetworksName.rinkeby:
      return NetworksId.rinkeby
    case NetworksName.goerli:
      return NetworksId.goerli
    case NetworksName.mumbai:
      return NetworksId.mumbai
    default:
      return ''
  }
}
export const networkNameById = (network: number) => {
  switch (network) {
    case NetworksId.ethereum:
      return NetworksName.ethereum
    case NetworksId.rinkeby:
      return NetworksName.rinkeby
    case NetworksId.goerli:
      return NetworksName.goerli
    case NetworksId.mumbai:
      return NetworksName.mumbai
    default:
      return ''
  }
}
