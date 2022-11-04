import { Web3Provider } from '@ethersproject/providers'
import { useTransaction } from '@nftfyorg/wallet'
import { useState } from 'react'
import { erc721Contract } from '../../../contracts/erc721/Erc721Contract'

export const useErc721Transfer = (signerProvider: Web3Provider) => {
  const [isExecuting, setIsExecuting] = useState(false)
  const { isLoading: isObserving, status, observe, dismiss } = useTransaction()

  const transfer = async (contractAddress: string, recipient: string, amount: string) => {
    setIsExecuting(true)

    const tx = await erc721Contract(signerProvider).transfer(contractAddress, recipient, amount)

    setIsExecuting(false)

    if (!tx) {
      return
    }

    observe(tx, signerProvider)
  }

  return {
    isLoading: isExecuting || isObserving,
    transfer,
    dismiss,
    status
  }
}
