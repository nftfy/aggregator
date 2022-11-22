import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { globalConfig } from '../../../config'
import {
  ListClaimsFloorCollectionsQueryData,
  ListClaimsFloorCollectionsQueryVars,
  LIST_CLAIMS_FLOOR_COLLECTIONS_QUERY
} from '../../../graphql/nftfy/rockpool/buyfloor/listClaimsFloorCollectionsQuery'

export function useListClaimsFloorCollections(chainId: number, address: string) {
  const [offSet, setOffset] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(true)

  const { data, loading, error, refetch, startPolling, stopPolling, fetchMore } = useQuery<
    ListClaimsFloorCollectionsQueryData,
    ListClaimsFloorCollectionsQueryVars
  >(LIST_CLAIMS_FLOOR_COLLECTIONS_QUERY, {
    variables: {
      chainId,
      address
    },
    onError: errorData => {
      console.error(errorData.networkError, 'Failed to obtain data')
      stopPolling()
    },
    onCompleted: listCollections => {
      if (listCollections.claimableFloorFractions) {
        startPolling(30000)
      }
    }
  })

  const loadMore = async () => {
    if (hasMore && !loading) {
      const isLoaded = (data?.claimableFloorFractions.length || 0) - globalConfig.paginationLimit >= globalConfig.paginationLimit
      const newOffset = Number(offSet) + globalConfig.paginationLimit
      try {
        const { data: nextPageData, error: nextPageError } = await fetchMore({
          variables: {
            offset: isLoaded ? data?.claimableFloorFractions.length || 0 : newOffset
          }
        })

        if (nextPageError) {
          console.error(nextPageError)
          return
        }

        setOffset(newOffset)
        setHasMore(nextPageData.claimableFloorFractions.length === globalConfig.paginationLimit)
      } catch (e) {
        console.error(e)
        return
      }
    }

    if (!data?.claimableFloorFractions.length) {
      setHasMore(false)
    }
  }

  useEffect(() => {
    setOffset(0)
  }, [chainId, address])

  if (error) {
    console.error(error)
    return { listClaimsFloorCollections: [], error, loading, refetch, loadMore, hasMore }
  }

  return { listClaimsFloorCollections: data?.claimableFloorFractions || [], loading, refetch, hasMore, loadMore }
}
