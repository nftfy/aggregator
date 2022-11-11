import { useLazyQuery } from '@apollo/client'

import {
  Erc1155ItemsByTokenIdListQueryData,
  Erc1155ItemsByTokenIdListQueryVars,
  ERC1155_ITEMS_BY_TOKEN_ID_LIST_QUERY
} from '@graphql/erc1155/Erc1155ItemsByTokenIdListQuery'
import { useEffect } from 'react'
import { notifyError } from '../../../services/UtilService'

export const useErc1155TokenIdListItems = (chainId: number, contractAddress: string, tokenIdList: string[]) => {
  const [execute, { loading, data, error }] = useLazyQuery<Erc1155ItemsByTokenIdListQueryData, Erc1155ItemsByTokenIdListQueryVars>(
    ERC1155_ITEMS_BY_TOKEN_ID_LIST_QUERY,
    {
      variables: {
        chainId,
        contractAddress: contractAddress?.toLowerCase(),
        tokenIdList
      },
      onError: errorData => {
        notifyError(errorData.networkError, 'Failed to obtain data')
      }
    }
  )

  useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { erc1155ItemsByTokenIdList: data?.erc1155ItemsByTokenIdList || [], loading, execute }
}
