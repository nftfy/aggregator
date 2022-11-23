import { useQuery } from '@apollo/client'
import {
  PoolProgressDetailsQueryData,
  PoolProgressDetailsQueryVars,
  POOL_PROGRESS_DETAILS_QUERY
} from '../../../graphql/nftfy/rockpool/buyfloor/PoolProgressDetailsQuery'

export const usePoolProgress = (chainId: number, poolId?: string) => {
  const { loading, refetch, data } = useQuery<PoolProgressDetailsQueryData, PoolProgressDetailsQueryVars>(POOL_PROGRESS_DETAILS_QUERY, {
    variables: {
      chainId,
      poolId: poolId || ''
    },
    skip: !poolId,
    onError: () => {
      console.error({
        type: 'error',
        text: 'error',
        duration: 5
      })
    }
  })

  return {
    loading,
    refetch,
    poolProgress: data?.poolProgress
  }
}
