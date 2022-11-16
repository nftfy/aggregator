import { useQuery } from '@apollo/client'
import {
  ItemFloorPriceQueryData,
  ItemFloorPriceQueryVars,
  ITEM_FLOOR_PRICE_QUERY
} from '../../../graphql/nftfy/rockpool/buyfloor/ItemFloorPriceQuery'

export const useItemFloorPrice = (chainId: number, collectionAddress: string) => {
  const { loading, error, refetch, data } = useQuery<ItemFloorPriceQueryData, ItemFloorPriceQueryVars>(ITEM_FLOOR_PRICE_QUERY, {
    pollInterval: 30000,
    variables: {
      chainId,
      collectionAddress: collectionAddress.toLocaleLowerCase()
    },
    skip: !collectionAddress,
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
    itemFloorPrice: data?.itemFloorPrice
  }
}
