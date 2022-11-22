import { useEffect, useState } from 'react'
import { usePrepareContractWrite, useSendTransaction } from 'wagmi'
import { erc721Abi } from '../../../contracts/erc721/Erc721Abi'
import { useObserverTransaction } from '../../shared/useObserveTransaction'

export const useErc721SetApprovalForAll = (contractAddress: string, spenderAddress: string) => {
  const [isExecuting, setIsExecuting] = useState(false)
  const { config } = usePrepareContractWrite({
    addressOrName: contractAddress,
    contractInterface: erc721Abi,
    functionName: 'setApprovalForAll',
    args: [spenderAddress, true]
  })

  const { sendTransaction, isSuccess, data } = useSendTransaction(config)
  const { isLoading: isLoading, status, dismiss } = useObserverTransaction(data, isSuccess)

  useEffect(() => {
    if (!isLoading && status === 'success') {
      setIsExecuting(false)
      dismiss()
    }
  }, [dismiss, isLoading, status])

  return {
    isLoading: isLoading || isExecuting,
    setApprovalForAll: () => {
      if (sendTransaction) {
        setIsExecuting(true)
        sendTransaction()
      }
    },
    status: isSuccess
  }
}
