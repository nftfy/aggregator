import { useQuery } from '@apollo/client'
import { StakingPoolsData, StakingPoolsVars, STAKING_POOLS_QUERY } from '@graphql/pool/StakingPoolsQuery'
import { useEffect, useState } from 'react'
import { notifyError } from '../../services/UtilService'

export const useStakingPools = (
  chainId: number,
  walletInitialized: boolean,
  filterBy: string,
  accountAddress?: string,
  tokenList?: string[],
  stakedOnly?: boolean
) => {
  const paginationLimit = 8
  const [offset, setOffset] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [isRefetching, setIsRefetching] = useState<boolean>(false)

  const { loading, fetchMore, data, refetch } = useQuery<StakingPoolsData, StakingPoolsVars>(STAKING_POOLS_QUERY, {
    fetchPolicy: 'cache-and-network',
    variables: {
      chainId,
      accountAddress: accountAddress?.toLowerCase(),
      limit: paginationLimit,
      offset,
      filterBy,
      tokenList,
      stakedOnly
    },
    notifyOnNetworkStatusChange: true,
    onError: errorData => {
      notifyError(errorData.networkError, 'Failed to obtain data ')
    }
  })
  const loadMore = async () => {
    if (!isRefetching && walletInitialized && !loading && !data?.stakingPools.length) {
      setHasMore(false)
    }

    if (hasMore && !loading && !isRefetching && walletInitialized) {
      const newOffset = offset + paginationLimit
      const { data: nextPageData, error: nextPageError } = await fetchMore({
        variables: {
          offset: newOffset
        }
      })

      if (nextPageError) {
        throw nextPageError
      }

      setOffset(newOffset)
      setHasMore(nextPageData.stakingPools.length === paginationLimit)
    }
  }

  const handleRefetch = async () => {
    setIsRefetching(true)

    const { loading: isRefetchLoading } = await refetch({
      chainId,
      accountAddress: accountAddress?.toLowerCase(),
      limit: offset ? offset + paginationLimit : paginationLimit,
      offset: 0,
      filterBy,
      tokenList,
      stakedOnly
    })

    setIsRefetching(isRefetchLoading)
  }

  useEffect(() => {
    if (!walletInitialized) {
      return
    }

    setOffset(0)
    setHasMore(true)
  }, [chainId, accountAddress, walletInitialized, filterBy, stakedOnly, tokenList])

  return {
    stakingPools: data?.stakingPools || [],
    loading,
    loadMore,
    hasMore,
    refetch: handleRefetch,
    isRefetching
  }
}
