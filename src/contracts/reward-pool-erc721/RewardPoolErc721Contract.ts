import { ethers } from 'ethers'
import { getGasLimit, getGasPrice, notifyError } from '../../services/UtilService'
import { rewardPoolErc721Abi } from './RewardPoolErc721Abi'

interface RewardPoolContractErc721 {
  harvest(poolAddress: string, rewardToken: string): Promise<string | undefined>
  addRewardToken(poolAddress: string, rewardToken: string): Promise<string | undefined>
  updateRewardPerSec(poolAddress: string, rewardToken: string, rewardPerSec: string): Promise<string | undefined>
  deposit(poolAddress: string, tokenIds: string[]): Promise<string | undefined>
  withdraw(poolAddress: string, tokenIds: string[]): Promise<string | undefined>
  exit(poolAddress: string, tokenIds: string[]): Promise<string | undefined>
}

export const rewardPoolErc721Contract = (signerProvider: ethers.providers.Web3Provider): RewardPoolContractErc721 => {
  return {
    async addRewardToken(poolAddress: string, rewardToken: string): Promise<string | undefined> {
      try {
        const signer = signerProvider.getSigner()
        const pool = new ethers.Contract(poolAddress, rewardPoolErc721Abi, signer)
        const gasLimit = await pool.estimateGas.addRewardToken(rewardToken)
        const gasPrice = await getGasPrice(signerProvider)

        const txRequest = await pool.addRewardToken(rewardToken, {
          gasLimit: getGasLimit(gasLimit),
          gasPrice
        })

        return txRequest.hash as string
      } catch (e) {
        notifyError(e, 'Failed to execute transaction')
        return undefined
      }
    },
    async updateRewardPerSec(poolAddress: string, rewardToken: string, rewardPerSec: string): Promise<string | undefined> {
      try {
        const signer = signerProvider.getSigner()
        const pool = new ethers.Contract(poolAddress, rewardPoolErc721Abi, signer)
        const gasLimit = await pool.estimateGas.updateRewardPerSec(rewardToken, rewardPerSec)
        const gasPrice = await getGasPrice(signerProvider)

        const txRequest = await pool.updateRewardPerSec(rewardToken, rewardPerSec, {
          gasLimit: getGasLimit(gasLimit),
          gasPrice
        })

        return txRequest.hash as string
      } catch (e) {
        notifyError(e, 'Failed to execute transaction')
        return undefined
      }
    },
    async harvest(poolAddress: string, rewardToken: string): Promise<string | undefined> {
      try {
        const signer = signerProvider.getSigner()
        const pool = new ethers.Contract(poolAddress, rewardPoolErc721Abi, signer)
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
    async deposit(poolAddress: string, tokenIds: string[]): Promise<string | undefined> {
      try {
        const signer = signerProvider.getSigner()
        const pool = new ethers.Contract(poolAddress, rewardPoolErc721Abi, signer)
        const gasLimit = await pool.estimateGas.deposit(tokenIds, true)
        const gasPrice = await getGasPrice(signerProvider)

        const txRequest = await pool.deposit(tokenIds, true, {
          gasLimit: getGasLimit(gasLimit),
          gasPrice
        })

        return txRequest.hash as string
      } catch (e) {
        notifyError(e, 'Failed to execute transaction')
        return undefined
      }
    },
    async withdraw(poolAddress: string, tokenIds: string[]): Promise<string | undefined> {
      try {
        const signer = signerProvider.getSigner()
        const pool = new ethers.Contract(poolAddress, rewardPoolErc721Abi, signer)
        const gasLimit = await pool.estimateGas.withdraw(tokenIds, true)
        const gasPrice = await getGasPrice(signerProvider)

        const txRequest = await pool.withdraw(tokenIds, true, {
          gasLimit: getGasLimit(gasLimit),
          gasPrice
        })

        return txRequest.hash as string
      } catch (e) {
        notifyError(e, 'Failed to execute transaction')
        return undefined
      }
    },
    async exit(poolAddress: string, tokenIds: string[]): Promise<string | undefined> {
      try {
        const signer = signerProvider.getSigner()
        const pool = new ethers.Contract(poolAddress, rewardPoolErc721Abi, signer)
        const gasLimit = await pool.estimateGas.exit(tokenIds)
        const gasPrice = await getGasPrice(signerProvider)

        const txRequest = await pool.exit(tokenIds, {
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
