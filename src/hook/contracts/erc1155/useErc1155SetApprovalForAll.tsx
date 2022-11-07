import { Web3Provider } from '@ethersproject/providers'
import { useState } from 'react'
import { erc1155Contract } from '../../../contracts/erc1155/Erc1155Contract'

export const useErc1155SetApprovalForAll = () => {
  const [isExecuting, setIsExecuting] = useState(false)

  const setApprovalForAll = async (signerProvider: Web3Provider, contractAddress: string, spenderAddress: string) => {
    setIsExecuting(true)
    const chainService = erc1155Contract(signerProvider)
    const tx = await chainService.setApprovalForAll(contractAddress, spenderAddress, true)

    setIsExecuting(false)

    if (!tx) {
      return
    }
  }

  return {
    isLoading: isExecuting,
    setApprovalForAll,
    dismiss: () => {},
    status: false
  }
}
