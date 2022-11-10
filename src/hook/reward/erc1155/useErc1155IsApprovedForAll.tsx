import { useQuery } from '@apollo/client'
import {
  IsApprovedForAllErc1155QueryData,
  IsApprovedForAllErc1155QueryVars,
  IS_APPROVED_FOR_ALL_ERC1155_QUERY
} from '@graphql/erc1155/Erc1155CheckApproveForAll'
import { useState } from 'react'
import { notifyError } from '../../../services/UtilService'

export function UseErc1155IsApprovedForAll(collectionAddress: string, ownerAddress: string, spenderAddress: string, chainId: number) {
  const [isApprovedForAll, setIsApprovedForAll] = useState(false)
  const { loading, refetch } = useQuery<IsApprovedForAllErc1155QueryData, IsApprovedForAllErc1155QueryVars>(
    IS_APPROVED_FOR_ALL_ERC1155_QUERY,
    {
      variables: {
        chainId,
        collectionAddress,
        spender: spenderAddress,
        ownerAccount: ownerAddress
      },
      skip: !ownerAddress || !collectionAddress || !spenderAddress || isApprovedForAll,
      onCompleted: data => setIsApprovedForAll(data.isApprovedForAllErc1155),
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
