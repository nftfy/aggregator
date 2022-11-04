import { Web3Provider } from '@ethersproject/providers'
import { useTransaction } from '@nftfyorg/wallet'
import { useState } from 'react'
import { erc721Contract } from '../../../contracts/erc721/Erc721Contract'

export const useErc721SetApprovalForAll = () => {
  const [isExecuting, setIsExecuting] = useState(false)

  const { isLoading: isObserving, status, observe, dismiss } = useTransaction()

  const setApprovalForAll = async (signerProvider: Web3Provider, contractAddress: string, spenderAddress: string) => {
    setIsExecuting(true)
    const tx = await erc721Contract(signerProvider).setApprovalForAll(contractAddress, spenderAddress, true)

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
