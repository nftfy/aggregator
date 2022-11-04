import { useQuery } from '@apollo/client'
import { AllowedCreatePoolQueryData, AllowedCreatePoolQueryVar, ALLOWED_CREATE_POOL_QUERY } from '../../graphql/pool/AllowedCreatePool'

export const useIsAllowedCreatePool = (walletAddress?: string) => {
  const { data, error } = useQuery<AllowedCreatePoolQueryData, AllowedCreatePoolQueryVar>(ALLOWED_CREATE_POOL_QUERY, {
    variables: {
      walletAddress: walletAddress ?? ''
    },
    skip: !walletAddress
  })
  if (!data || error) {
    return false
  }
  return data?.isAllowedWallet
}
