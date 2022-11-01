import { ContractTransaction, ethers } from 'ethers'
import { getGasPrice, notifyError } from '../../services/UtilService'
import { rewardPoolErc721FactoryAbi } from './RewardPoolErc721FactoryAbi'

interface RewardPoolErc721FactoryContract {
  createPool(collectionAddress: string): Promise<ContractTransaction | undefined>
}

export const rewardPoolErc721FactoryContract = (
  factoryAddress: string,
  signerProvider: ethers.providers.Web3Provider
): RewardPoolErc721FactoryContract => {
  return {
    async createPool(collectionAddress: string): Promise<ContractTransaction | undefined> {
      try {
        const signer = signerProvider.getSigner()
        const poolFactory = new ethers.Contract(factoryAddress, rewardPoolErc721FactoryAbi, signer)
        const params = [Date.now(), collectionAddress]

        const gasLimit = await poolFactory.estimateGas.createPool(...params)
        const gasPrice = await getGasPrice(signerProvider)

        const transaction = await poolFactory.functions.createPool(...params, {
          gasLimit,
          gasPrice
        })

        return transaction as ContractTransaction
      } catch (e) {
        notifyError(e, 'Failed to execute transaction')
        return undefined
      }
    }
  }
}
