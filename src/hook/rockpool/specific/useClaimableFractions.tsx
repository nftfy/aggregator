import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { globalConfig } from '../../../config'
import {
  ClaimableRockpoolByFractionsData,
  ClaimableRockpoolByFractionsVars,
  CLAIMABLE_ROCKPOOL_BY_FRACTIONS
} from '../../../graphql/nftfy/rockpool/SpecificClaimableFractions'

export const useClaimableFractions = (chainId: number, buyer: string) => {
  const [offset, setOffset] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [paginationLoading, setPaginationLoading] = useState<boolean>(false)
  const { loading, data, refetch, error, fetchMore } = useQuery<ClaimableRockpoolByFractionsData, ClaimableRockpoolByFractionsVars>(
    CLAIMABLE_ROCKPOOL_BY_FRACTIONS,
    {
      variables: {
        chainId,
        buyer,
        limit: 0,
        offset: 0
      },
      skip: !buyer,
      onError: () => {
        console.error({
          type: 'error',
          text: 'error',
          duration: 5
        })
      }
    }
  )

  const loadMore = async () => {
    if (hasMore && !loading) {
      setPaginationLoading(true)
      const isLoaded = (data?.claimableRockpoolFractions.length || 0) - globalConfig.paginationLimit >= globalConfig.paginationLimit
      const newOffset = Number(offset) + globalConfig.paginationLimit
      try {
        const { data: nextPageData, error: nextPageError } = await fetchMore({
          variables: {
            offset: isLoaded ? data?.claimableRockpoolFractions.length || 0 : newOffset
          }
        })

        if (nextPageError) {
          console.error(nextPageError)
          return
        }

        setOffset(newOffset)
        setHasMore(nextPageData.claimableRockpoolFractions.length === globalConfig.paginationLimit)
      } catch (e) {
        console.error(e)
        setPaginationLoading(false)
        return
      }
    }

    if (!data?.claimableRockpoolFractions.length) {
      setHasMore(false)
    }
  }

  useEffect(() => {
    setOffset(0)
  }, [chainId, buyer])

  if (error) {
    console.error(error)
    return { claimableFractions: [], loading, refetch, loadMore, hasMore }
  }

  return { claimableFractions: data?.claimableRockpoolFractions || [], loading, refetch, hasMore, loadMore, paginationLoading }
}
