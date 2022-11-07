import { useQuery } from '@apollo/client'

import {
  Erc1155TargetByOwnerQueryData,
  Erc1155TargetByOwnerQueryVars,
  ERC1155_TARGET_BY_OWNER_QUERY
} from '@graphql/erc1155/Erc1155TargetByOwner'
import { useEffect, useState } from 'react'
import { notifyError } from '../../services/UtilService'

export const useErc1155TargetByOwner = (chainId: number, contractAddress: string, ownerAddress: string) => {
  const paginationLimit = 10
  const [offset, setOffset] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(true)

  const { loading, data, fetchMore, error, refetch } = useQuery<Erc1155TargetByOwnerQueryData, Erc1155TargetByOwnerQueryVars>(
    ERC1155_TARGET_BY_OWNER_QUERY,
    {
      variables: {
        chainId,
        contractAddress: contractAddress?.toLowerCase(),
        ownerAddress: ownerAddress?.toLowerCase(),
        limit: paginationLimit,
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
    if (ownerAddress) {
      refetch()
    }
  }, [ownerAddress, refetch])

  useEffect(() => {
    setOffset(0)
    setHasMore(true)
  }, [chainId])

  useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { erc721TargetByOwner: data?.targetNftByOwner || [], loading, loadMore, hasMore, refetch }
}
