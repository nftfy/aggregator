import { ethers } from 'ethers'
import { getGasLimit, getGasPrice, notifyError } from '../../services/UtilService'
import { erc721Abi } from './Erc721Abi'

interface Erc721Contract {
  transfer(contractAddress: string, recipient: string, amount: string): Promise<string | undefined>
  setApprovalForAll(contractAddress: string, operator: string, approved: boolean): Promise<string | undefined>
}

export const erc721Contract = (signerProvider: ethers.providers.Web3Provider): Erc721Contract => {
  return {
    async setApprovalForAll(contractAddress: string, operator: string, approved: boolean): Promise<string | undefined> {
      try {
        const signer = signerProvider.getSigner()
        const erc721 = new ethers.Contract(contractAddress, erc721Abi, signer)
        const gasLimit = await erc721.estimateGas.setApprovalForAll(operator, approved)
        const gasPrice = await getGasPrice(signerProvider)

        const txRequest = await erc721.setApprovalForAll(operator, approved, {
          gasLimit: getGasLimit(gasLimit),
          gasPrice
        })

        return txRequest.hash as string
      } catch (e) {
        notifyError(e, 'Failed to execute transaction')
        return undefined
      }
    },
    async transfer(contractAddress: string, recipient: string, amount: string): Promise<string | undefined> {
      try {
        const signer = signerProvider.getSigner()
        const erc721 = new ethers.Contract(contractAddress, erc721Abi, signer)
        const gasLimit = await erc721.estimateGas.transfer(recipient, amount)
        const gasPrice = await getGasPrice(signerProvider)

        const txRequest = await erc721.transfer(recipient, amount, {
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
