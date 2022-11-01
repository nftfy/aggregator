import { useLazyQuery } from '@apollo/client'
import {
  StakingPoolsData,
  StakingPoolsVars,
  STAKING_POOLS_QUERY,
} from '@graphql/pool/StakingPoolsQuery'
import { useEffect, useState } from 'react'
import { notifyError } from '../../services/UtilService'

export const useStakingPools = (
  chainId: number,
  walletInitialized: boolean,
  filter: string,
  accountAddress?: string
) => {
  const paginationLimit = 100
  const [offset, setOffset] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(true)

  const [isInitLoad, setInitLoad] = useState<boolean>(true)
  const [isRefetching, setIsRefetching] = useState<boolean>(false)
  const [getPools, { loading, fetchMore, data }] = useLazyQuery<
    StakingPoolsData,
    StakingPoolsVars
  >(STAKING_POOLS_QUERY, {
    variables: {
      chainId,
      accountAddress: accountAddress?.toLowerCase(),
      limit: paginationLimit,
      offset,
      filterBy: filter,
    },
    notifyOnNetworkStatusChange: true,
    onError: (errorData) => {
      notifyError(errorData.networkError, 'Failed to obtain data ')
    },
  })

  useEffect(() => {
    if (!walletInitialized) {
      return
    }

    getPools({
      variables: {
        chainId,
        accountAddress: accountAddress?.toLowerCase(),
        limit: paginationLimit,
        offset: 0,
        filterBy: filter,
      },
    })

    setInitLoad(false)
  }, [
    accountAddress,
    chainId,
    getPools,
    paginationLimit,
    walletInitialized,
    filter,
  ])

  const loadMore = async () => {
    if (
      !isRefetching &&
      walletInitialized &&
      !loading &&
      !data?.stakingPools.length
    ) {
      setHasMore(false)
    }

    if (hasMore && !loading && !isRefetching && walletInitialized) {
      const newOffset = offset + paginationLimit
      const { data: nextPageData, error: nextPageError } = await fetchMore({
        variables: {
          offset: newOffset,
        },
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
    const { loading: isRefetchLoading } = await getPools({
      variables: {
        chainId,
        accountAddress: accountAddress?.toLowerCase(),
        limit: offset ? offset + paginationLimit : paginationLimit,
        offset: 0,
        filterBy: filter,
      },
      fetchPolicy: 'no-cache',
    })
    setIsRefetching(isRefetchLoading)
  }

  useEffect(() => {
    if (!walletInitialized) {
      return
    }

    setOffset(0)
    setHasMore(true)
  }, [chainId, accountAddress, walletInitialized, filter])

  return {
    stakingPools: data?.stakingPools || [],
    loading: isInitLoad || loading,
    loadMore,
    hasMore,
    refetch: handleRefetch,
    isRefetching,
  }
}
