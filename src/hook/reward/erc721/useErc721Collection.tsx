import { useLazyQuery } from '@apollo/client'
import { Erc721CollectionData, Erc721CollectionVars, ERC721_COLLECTION } from '../../../graphql/erc721/erc721CollectionQuery'
import { notifyError } from '../../../services/UtilService'

export function useErc721Collection() {
  const [getErc721Collection, { loading, data, error }] = useLazyQuery<Erc721CollectionData, Erc721CollectionVars>(ERC721_COLLECTION, {
    onError: errorData => {
      notifyError(errorData.networkError, 'Failed to obtain data')
    }
  })

  return {
    getErc721Collection,
    loading,
    ...data,
    error
  }
}
