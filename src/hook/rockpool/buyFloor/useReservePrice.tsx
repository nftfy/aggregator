import { useQuery } from '@apollo/client'
import {
  ReservePriceQueryData,
  ReservePriceQueryVars,
  RESERVE_PRICE_QUERY
} from '../../../graphql/nftfy/rockpool/buyfloor/ReservePriceQuery'

export const useReservePrice = (chainId: number, floorPrice?: string, poolId?: string) => {
  const { loading, error, refetch, data } = useQuery<ReservePriceQueryData, ReservePriceQueryVars>(RESERVE_PRICE_QUERY, {
    notifyOnNetworkStatusChange: true,
    variables: {
      chainId,
      floorPrice: floorPrice || '',
      id: poolId
    },
    skip: !floorPrice || !poolId,
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
    reservePrice: data?.buyFloorReservePrice.reservePrice
  }
}
