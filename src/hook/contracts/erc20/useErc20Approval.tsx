import { usePrepareContractWrite, useSendTransaction } from 'wagmi'
import { useObserverTransaction } from '../../shared/useObserveTransaction'
import erc20Abi from './erc20Abi'

export const useErc20Approval = (contractAddress: string, spenderAddress: string, amount: string) => {
  const { config } = usePrepareContractWrite({
    addressOrName: contractAddress,
    contractInterface: erc20Abi,
    functionName: 'approve',
    args: [spenderAddress, amount]
  })
  const { sendTransaction, isSuccess, data, isLoading: isLoadingTransactionWallet } = useSendTransaction(config)
  const { isLoading: isLoading, status, dismiss } = useObserverTransaction(data, isSuccess)

  return {
    isLoading: isLoadingTransactionWallet || isLoading,
    setApproveErc20: sendTransaction,
    dismiss,
    status
  }
}
