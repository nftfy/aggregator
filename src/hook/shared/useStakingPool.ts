import { useQuery } from '@apollo/client'
import { StakingPoolData, StakingPoolVars, STAKING_POOL_QUERY } from '../../graphql/pool/StakingPoolQuery'

import { notifyError } from '../../services/UtilService'

interface UseStakingPoolProps {
  chainId?: number
  poolAddress?: string
  accountAddress?: string
}

export const useStakingPool = ({ chainId, poolAddress, accountAddress }: UseStakingPoolProps) => {
  const { loading, refetch, data } = useQuery<StakingPoolData, StakingPoolVars>(STAKING_POOL_QUERY, {
    fetchPolicy: 'no-cache',
    skip: !chainId || !poolAddress,
    notifyOnNetworkStatusChange: true,
    variables: {
      chainId,
      poolAddress,
      accountAddress: accountAddress?.toLowerCase()
    },
    onError: errorData => {
      notifyError(errorData.networkError, 'Failed to obtain data ')
    }
  })
  const handleGetPool = async (variables: UseStakingPoolProps) => {
    const { data: result } = await refetch({
      ...variables,
      poolAddress: variables?.poolAddress?.toLocaleLowerCase(),
      accountAddress: variables?.accountAddress?.toLowerCase()
    })

    return result
  }

  return {
    getPool: handleGetPool,
    loading,
    data: data?.stakingPool
  }
}
