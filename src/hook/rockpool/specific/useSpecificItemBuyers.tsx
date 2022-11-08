import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import {
  SpecificItemBuyersData,
  SpecificItemBuyersVars,
  SPECIFIC_ITEM_BUYERS_QUERY
} from '../../../graphql/nftfy/rockpool/SpecificItemBuyersQuery'

export const useSpecificItemBuyers = (chainId: number, specificItemId: string) => {
  const paginationLimit = 50
  const { loading, data, error, refetch } = useQuery<SpecificItemBuyersData, SpecificItemBuyersVars>(SPECIFIC_ITEM_BUYERS_QUERY, {
    variables: {
      chainId,
      rockpoolItemId: specificItemId,
      limit: paginationLimit,
      offset: 0
    }
  })

  useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return {
    loading,
    specificBuyersItem: data?.rockpoolItemBuyers || [],
    specificBuyersCount: data?.buyersCountRockpoolItems.buyersCount || 0,
    refetch
  }
}
