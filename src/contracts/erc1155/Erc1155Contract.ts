import { ethers } from 'ethers'
import { getGasLimit, getGasPrice, notifyError } from '../../services/UtilService'
import { erc1155Abi } from './Erc1155Abi'

interface Erc1155Contract {
  setApprovalForAll(contractAddress: string, operator: string, approved: boolean): Promise<string | undefined>
}

export const erc1155Contract = (signerProvider: ethers.providers.Web3Provider): Erc1155Contract => {
  return {
    async setApprovalForAll(contractAddress: string, operator: string, approved: boolean): Promise<string | undefined> {
      try {
        const signer = signerProvider.getSigner()
        const erc1155 = new ethers.Contract(contractAddress, erc1155Abi, signer)
        const gasLimit = await erc1155.estimateGas.setApprovalForAll(operator, approved)
        const gasPrice = await getGasPrice(signerProvider)

        const txRequest = await erc1155.setApprovalForAll(operator, approved, {
          gasLimit: getGasLimit(gasLimit),
          gasPrice
        })

        return txRequest.hash as string
      } catch (error) {
        notifyError(error, 'Failed to execute transaction')
        return undefined
      }
    }
  }
}
