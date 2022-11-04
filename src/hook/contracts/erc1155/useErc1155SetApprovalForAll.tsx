import { Web3Provider } from '@ethersproject/providers'
import { useTransaction } from '@nftfyorg/wallet'
import { useState } from 'react'
import { erc1155Contract } from '../../../contracts/erc1155/Erc1155Contract'

export const useErc1155SetApprovalForAll = () => {
  const [isExecuting, setIsExecuting] = useState(false)
  const { isLoading: isObserving, status, observe, dismiss } = useTransaction()

  const setApprovalForAll = async (signerProvider: Web3Provider, contractAddress: string, spenderAddress: string) => {
    setIsExecuting(true)
    const chainService = erc1155Contract(signerProvider)
    const tx = await chainService.setApprovalForAll(contractAddress, spenderAddress, true)

    setIsExecuting(false)

    if (!tx) {
      return
    }

    observe(tx, signerProvider)
  }

  return {
    isLoading: isExecuting || isObserving,
    setApprovalForAll,
    dismiss,
    status
  }
}
