import { useLazyQuery } from '@apollo/client'

import { useEffect } from 'react'
import {
  ERC721_ITEMS_BY_TOKEN_ID_LIST_QUERY,
  Erc721ItemsByTokenIdListQueryData,
  Erc721ItemsByTokenIdListQueryVars
} from '@graphql/erc721/Erc721ItemsByTokenIdListQuery'
import { notifyError } from '../../services/UtilService'

export const useErc721TokenIdListItems = (chainId: number, contractAddress: string, tokenIdList: string[]) => {
  const [execute, { loading, data, error }] = useLazyQuery<Erc721ItemsByTokenIdListQueryData, Erc721ItemsByTokenIdListQueryVars>(
    ERC721_ITEMS_BY_TOKEN_ID_LIST_QUERY,
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

  return { erc721TargetByOwner: data?.erc721ItemsByTokenIdList || [], loading, execute }
}
