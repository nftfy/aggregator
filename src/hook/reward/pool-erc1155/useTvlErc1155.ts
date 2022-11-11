import { useLazyQuery } from '@apollo/client'
import { STAKED_TVL_ERC1155_QUERY, TvlErc1155QueryData, TvlErc1155QueryVars } from '@graphql/pool/tvl/TvlErc1155Query'
import { notifyError } from '../../services/UtilService'

export const useTvlErc1155 = () => {
  const [getTvlErc1155, { loading, data, error }] = useLazyQuery<TvlErc1155QueryData, TvlErc1155QueryVars>(STAKED_TVL_ERC1155_QUERY, {
    onError: errorData => {
      notifyError(errorData.networkError, 'Failed to obtain data')
    }
  })

  return {
    getTvlErc1155,
    loading,
    data,
    error
  }
}
