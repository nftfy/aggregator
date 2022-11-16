import { useQuery } from '@apollo/client'
import { PoolBuyersQueryData, PoolBuyersQueryVars, POOL_BUYERS_QUERY } from '../../../graphql/nftfy/rockpool/buyfloor/PoolBuyersQuery'

export const usePoolBuyers = (chainId: number, poolId?: string) => {
  const { loading, error, refetch, data } = useQuery<PoolBuyersQueryData, PoolBuyersQueryVars>(POOL_BUYERS_QUERY, {
    notifyOnNetworkStatusChange: true,
    variables: {
      chainId,
      poolId: poolId || '0'
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
    error,
    refetch,
    buyers: data?.buyFloorBuyers || []
  }
}
