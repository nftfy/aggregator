import { Web3Provider } from '@ethersproject/providers'

import { useState } from 'react'
import { erc721Contract } from '../../../contracts/erc721/Erc721Contract'

export const useErc721SetApprovalForAll = () => {
  const [isExecuting, setIsExecuting] = useState(false)

  const setApprovalForAll = async (signerProvider: Web3Provider, contractAddress: string, spenderAddress: string) => {
    setIsExecuting(true)
    const tx = await erc721Contract(signerProvider).setApprovalForAll(contractAddress, spenderAddress, true)

    setIsExecuting(false)

    if (!tx) {
      return
    }
  }

  return {
    isLoading: isExecuting,
    setApprovalForAll,
    dismiss: () => {},
    status
  }
}
