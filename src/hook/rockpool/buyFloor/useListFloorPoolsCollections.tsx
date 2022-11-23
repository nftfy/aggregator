import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { globalConfig } from '../../../config'
import {
  ListFloorPoolsCollectionsQueryData,
  ListFloorPoolsCollectionsQueryVars,
  LIST_FLOOR_POOLS_COLLECTIONS
} from '../../../graphql/nftfy/rockpool/buyfloor/listingFloorPools'
import { BuyFloorStatus } from '../../../models/rockpool/floor/BuyFloorStatusEnum'

export const useListFloorPoolsCollections = (
  chainId: number,
  collectionAddress: string,
  paymentTokenAddress: string,
  status: BuyFloorStatus,
  account: string,
  offset?: number,
  orderField?: string,
  orderDirection?: 'desc' | 'asc'
) => {
  const [offSet, setOffset] = useState<number>(offset || 0)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const { loading, error, refetch, data, fetchMore } = useQuery<ListFloorPoolsCollectionsQueryData, ListFloorPoolsCollectionsQueryVars>(
    LIST_FLOOR_POOLS_COLLECTIONS,
    {
      pollInterval: 30000,
      variables: {
        chainId,
        collectionAddress: collectionAddress.toLocaleLowerCase(),
        paymentTokenAddress,
        status,
        buyerAccount: account,
        orderDirection: orderDirection || 'desc',
        orderBy: orderField || 'roundNumber',
        offset: offset || 1,
        limit: globalConfig.paginationLimit
      },
      skip: !collectionAddress || !chainId,
      onError: () => {
        console.error('error', 'error')
      }
    }
  )

  const loadMore = async () => {
    if (hasMore && !loading) {
      const isLoaded = (data?.listingPools.length || 0) - globalConfig.paginationLimit >= globalConfig.paginationLimit
      const newOffset = Number(offSet) + globalConfig.paginationLimit
      try {
        const { data: nextPageData, error: nextPageError } = await fetchMore({
          variables: {
            offset: isLoaded ? data?.listingPools.length || 0 : newOffset
          }
        })

        if (nextPageError) {
          console.error(nextPageError)
          return
        }

        setOffset(newOffset)
        setHasMore(nextPageData.listingPools.length === globalConfig.paginationLimit)
      } catch (e) {
        console.error(e)
        return
      }
    }

    if (!data?.listingPools.length) {
      setHasMore(false)
    }
  }

  useEffect(() => {
    setOffset(0)
  }, [chainId, collectionAddress, status, account])

  if (error) {
    console.error(error)
    return { listFloorPoolsCollections: [], error, loading, refetch, loadMore, hasMore }
  }

  return {
    loading,
    error,
    refetch,
    listFloorPoolsCollections: data?.listingPools,
    loadMore,
    hasMore
  }
}
