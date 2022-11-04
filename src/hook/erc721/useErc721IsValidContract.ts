import { useLazyQuery } from '@apollo/client'
import { Erc721IsValidContractData, Erc721IsValidContractVars, IS_VALID_ERC721_QUERY } from '../../graphql/erc721/Erc721isValidContract'
import { notifyError } from '../../services/UtilService'

export function useErc721IsValidContract() {
  const [getIsValidContract, { loading, error }] = useLazyQuery<Erc721IsValidContractData, Erc721IsValidContractVars>(
    IS_VALID_ERC721_QUERY,
    {
      onError: err => {
        notifyError(err.networkError, 'Failed to obtain data')
      }
    }
  )

  const handleGetIsValidContract = async (chainId: number, address: string): Promise<boolean> => {
    const result = await getIsValidContract({
      fetchPolicy: 'no-cache',
      variables: {
        chainId,
        address
      }
    })

    return result.data?.isValidERC721 || false
  }

  return {
    getIsValidContract: handleGetIsValidContract,
    loading,
    error
  }
}
