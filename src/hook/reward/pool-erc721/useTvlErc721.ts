import { useLazyQuery } from '@apollo/client'
import { STAKED_TVL_ERC721_QUERY, TvlErc721QueryData, TvlErc721QueryVars } from '@graphql/pool/tvl/TvlErc721Query'
import { notifyError } from '../../../services/UtilService'

export const useTvlErc721 = () => {
  const [getTvlErc721, { loading, data, error }] = useLazyQuery<TvlErc721QueryData, TvlErc721QueryVars>(STAKED_TVL_ERC721_QUERY, {
    onError: errorData => {
      if (errorData) {
        notifyError(errorData.networkError, 'Failed to obtain data')
      }
    }
  })

  return {
    getTvlErc721,
    loading,
    data,
    error
  }
}
