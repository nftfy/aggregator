import { useLazyQuery } from '@apollo/client'
import { StakingPoolData, StakingPoolVars, STAKING_POOL_QUERY } from '@graphql/pool/StakingPoolQuery'
import { notifyError } from '../../services/UtilService'

export const useStakingPool = () => {
  const [getPool] = useLazyQuery<StakingPoolData, StakingPoolVars>(STAKING_POOL_QUERY, {
    notifyOnNetworkStatusChange: true,
    onError: errorData => {
      notifyError(errorData.networkError, 'Failed to obtain data ')
    }
  })

  const handleGetPool = async (chainId: number, poolAddress: string) => {
    const { data } = await getPool({
      fetchPolicy: 'no-cache',
      variables: {
        chainId,
        poolAddress: poolAddress.toLowerCase()
      }
    })

    return data?.stakingPool
  }

  return {
    getPool: handleGetPool
  }
}
