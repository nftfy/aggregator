import { ethers } from 'ethers'
import { getGasLimit, getGasPrice, notifyError } from '../../services/UtilService'
import { rewardPoolErc1155Abi } from './RewardPoolErc1155Abi'

interface RewardPoolErc1155Contract {
  harvest(poolAddress: string, rewardToken: string): Promise<string | undefined>
  deposit(poolAddress: string, tokenIds: string[], amounts: string[]): Promise<string | undefined>
  withdraw(poolAddress: string, tokenIds: string[], amounts: string[]): Promise<string | undefined>
}
export const rewardPoolErc1155Contract = (signerProvider: ethers.providers.Web3Provider): RewardPoolErc1155Contract => {
  return {
    async harvest(poolAddress: string, rewardToken: string): Promise<string | undefined> {
      try {
        const signer = signerProvider.getSigner()
        const pool = new ethers.Contract(poolAddress, rewardPoolErc1155Abi, signer)
        const gasLimit = await pool.estimateGas.harvest(rewardToken)
        const gasPrice = await getGasPrice(signerProvider)

        const txRequest = await pool.harvest(rewardToken, {
          gasLimit: getGasLimit(gasLimit),
          gasPrice
        })
        return txRequest.hash as string
      } catch (e) {
        notifyError(e, 'Failed to execute transaction')
        return undefined
      }
    },
    async deposit(poolAddress: string, tokenIds: string[], amounts: string[]): Promise<string | undefined> {
      try {
        const signer = signerProvider.getSigner()
        const pool = new ethers.Contract(poolAddress, rewardPoolErc1155Abi, signer)
        const gasLimit = await pool.estimateGas.deposit(tokenIds, amounts, true)
        const gasPrice = await getGasPrice(signerProvider)

        const txRequest = await pool.deposit(tokenIds, amounts, true, {
          gasLimit: getGasLimit(gasLimit),
          gasPrice
        })

        return txRequest.hash as string
      } catch (e) {
        notifyError(e, 'Failed to execute transaction')
        return undefined
      }
    },
    async withdraw(poolAddress: string, tokenIds: string[], amounts: string[]): Promise<string | undefined> {
      try {
        const signer = signerProvider.getSigner()
        const pool = new ethers.Contract(poolAddress, rewardPoolErc1155Abi, signer)
        const gasLimit = await pool.estimateGas.withdraw(tokenIds, amounts, true)
        const gasPrice = await getGasPrice(signerProvider)

        const txRequest = await pool.withdraw(tokenIds, amounts, true, {
          gasLimit: getGasLimit(gasLimit),
          gasPrice
        })
        return txRequest.hash as string
      } catch (e) {
        notifyError(e, 'Failed to execute transaction')
        return undefined
      }
    }
  }
}
