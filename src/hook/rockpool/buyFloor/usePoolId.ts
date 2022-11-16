import { useQuery } from '@apollo/client'
import { chainConfig } from '../../../ChainConfig'
import { PoolIdQueryData, PoolIdQueryVars, POOL_ID_QUERY } from '../../../graphql/nftfy/rockpool/buyfloor/PoolIdQuery'

export const usePoolId = (chainId: number, collectionAddress: string) => {
  const config = chainConfig(chainId)
  const { address: paymentAddress } = config.nativeToken

  const { loading, refetch, data } = useQuery<PoolIdQueryData, PoolIdQueryVars>(POOL_ID_QUERY, {
    variables: {
      chainId,
      paymentAddress,
      collectionAddress
    },
    skip: !paymentAddress,
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
    poolData: data?.poolId
  }
}
