import { useQuery } from '@apollo/client'

import {
  Erc721TargetByOwnerQueryData,
  Erc721TargetByOwnerQueryVars,
  ERC721_TARGET_BY_OWNER_QUERY
} from '@graphql/wallet/Erc721TargetByOwner'
import { useEffect, useState } from 'react'
import { globalConfig } from '../../GlobalConfig'
import { notifyError } from '../../services/UtilService'

export const useErc721TargetByOwner = (chainId: number, contractAddress: string, ownerAddress: string, limit?: number) => {
  const { paginationLimit } = globalConfig
  const [offset, setOffset] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(true)

  const { loading, data, fetchMore, error, refetch } = useQuery<Erc721TargetByOwnerQueryData, Erc721TargetByOwnerQueryVars>(
    ERC721_TARGET_BY_OWNER_QUERY,
    {
      variables: {
        chainId,
        contractAddress: contractAddress?.toLowerCase(),
        ownerAddress: ownerAddress?.toLowerCase(),
        limit: limit || paginationLimit,
        offset
      },
      skip: !ownerAddress,
      onError: errorData => {
        notifyError(errorData.networkError, 'Failed to obtain data')
      }
    }
  )

  const loadMore = async () => {
    if (hasMore && !loading) {
      const isLoaded = (data?.targetNftByOwner.length || 0) - paginationLimit >= paginationLimit
      const newOffset = offset + paginationLimit
      const { data: nextPageData, error: nextPageError } = await fetchMore({
        variables: {
          offset: isLoaded ? data?.targetNftByOwner.length || 0 : newOffset
        }
      })
      if (nextPageError) {
        throw nextPageError
      }

      setOffset(newOffset)
      setHasMore(nextPageData.targetNftByOwner.length === paginationLimit)
    }

    if (!data?.targetNftByOwner.length) {
      setHasMore(false)
    }
  }

  useEffect(() => {
    setOffset(0)
    setHasMore(true)
  }, [chainId])

  useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  useEffect(() => {
    if (ownerAddress) {
      refetch()
    }
  }, [ownerAddress, refetch])

  return { erc721TargetByOwner: data?.targetNftByOwner || [], loading, loadMore, hasMore, refetch }
}
