import { useLazyQuery } from '@apollo/client'
import { Erc1155CollectionData, Erc1155CollectionVars, ERC1155_COLLECTION_QUERY } from '../../graphql/erc1155/Erc1155CollectionQuery'
import { notifyError } from '../../services/UtilService'

export function useErc1155Collection() {
  const [getErc1155Collection, { loading, data, error }] = useLazyQuery<Erc1155CollectionData, Erc1155CollectionVars>(
    ERC1155_COLLECTION_QUERY,
    {
      onError: errorData => {
        if (errorData.networkError) {
          notifyError(errorData.networkError, 'Failed to obtain data')
        }
      }
    }
  )

  if (error) {
    throw error
  }

  return {
    loading,
    getErc1155Collection,
    erc1155Collection: data?.erc1155Collection,
    error
  }
}
