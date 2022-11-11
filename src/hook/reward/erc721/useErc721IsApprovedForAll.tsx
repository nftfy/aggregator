import { useQuery } from '@apollo/client'
import {
  IsApprovedForAllErc721QueryData,
  IsApprovedForAllErc721QueryVars,
  IS_APPROVED_FOR_ALL_ERC721_QUERY
} from '@graphql/erc721/Erc721CheckApproveForAll'
import { useState } from 'react'
import { notifyError } from '../../../services/UtilService'

export function useErc721IsApprovedForAll(collectionAddress: string, ownerAddress: string, spenderAddress: string, chainId: number) {
  const [isApprovedForAll, setIsApprovedForAll] = useState(false)
  const { loading, refetch } = useQuery<IsApprovedForAllErc721QueryData, IsApprovedForAllErc721QueryVars>(
    IS_APPROVED_FOR_ALL_ERC721_QUERY,
    {
      variables: {
        chainId,
        collectionAddress,
        spender: spenderAddress,
        ownerAccount: ownerAddress
      },
      skip: !ownerAddress || !collectionAddress || !spenderAddress || isApprovedForAll,
      onCompleted: data => {
        setIsApprovedForAll(data.isApprovedForAllErc721)
      },
      onError: data => {
        notifyError(data.networkError, 'Failed to obtain data')
      }
    }
  )

  return {
    isApprovedForAll,
    refetch,
    isLoading: loading
  }
}
