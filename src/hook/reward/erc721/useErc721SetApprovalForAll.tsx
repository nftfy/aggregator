import { usePrepareContractWrite, useSendTransaction } from 'wagmi'
import { erc721Abi } from '../../../contracts/erc721/Erc721Abi'

export const useErc721SetApprovalForAll = (contractAddress: string, spenderAddress: string) => {
  const { config } = usePrepareContractWrite({
    addressOrName: contractAddress,
    contractInterface: erc721Abi,
    functionName: 'setApprovalForAll',
    args: [spenderAddress, true]
  })

  const { sendTransaction, isLoading, isSuccess } = useSendTransaction(config)

  return {
    isLoading: isLoading,
    setApprovalForAll: sendTransaction,
    status: isSuccess
  }
}
