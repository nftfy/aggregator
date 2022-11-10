import { useReactiveVar } from '@apollo/client'
import { SendTransactionResult } from '@wagmi/core'
import { useEffect, useState } from 'react'
import { transactionProcessingVar } from '../../graphql/variables/TransactionVariables'
import { theGraphService } from '../../services/TheGraphService'

export type TransactionStatus = 'standby' | 'success' | 'reverted' | 'pending'

export const useObserverTransaction = (data: SendTransactionResult | undefined, isSuccess: boolean, subgraphUrl?: string) => {
  const [status, setStatus] = useState<TransactionStatus>('standby')
  const transactionProcessing = useReactiveVar(transactionProcessingVar)

  const verifySubgraph = async (subgraph: string, blockNumber: number) => {
    if (!subgraph || !blockNumber) {
      return
    }

    const observeTheGraph = setInterval(async () => {
      const isSubgraphSynced = await theGraphService().isSynced(blockNumber, subgraph)

      if (!isSubgraphSynced) {
        return
      }

      clearInterval(observeTheGraph)
      transactionProcessingVar(false)
      setStatus('success')
    }, 2 * 1000)
  }

  const dismiss = () => {
    setStatus('standby')
    transactionProcessingVar(false)
  }

  useEffect(() => {
    const handleWait = async () => {
      try {
        const response = await data?.wait()
        if (subgraphUrl && response && response?.confirmations > 0) {
          verifySubgraph(subgraphUrl, response.blockNumber)
          return
        }
        setStatus(response && response?.confirmations > 0 ? 'success' : 'reverted')
        transactionProcessingVar(false)
      } catch (error) {
        setStatus('reverted')
        transactionProcessingVar(false)
      }
    }
    if (data && isSuccess) {
      transactionProcessingVar(true)
      handleWait()
    }
  }, [data])

  return {
    status,
    isLoading: transactionProcessing,
    dismiss
  }
}
