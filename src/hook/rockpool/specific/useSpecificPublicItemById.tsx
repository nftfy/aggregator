import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import {
  PublicSpecificItemByIdData,
  PublicSpecificItemByIdVars,
  PUBLIC_SPECIFIC_ITEM_BY_ID_QUERY
} from '../../../graphql/nftfy/rockpool/SpecificPublicItemByIdQuery'

export const useSpecificPublicItemById = (rockpoolItemId: string, chainId: number) => {
  const { data, loading, error, refetch } = useQuery<PublicSpecificItemByIdData, PublicSpecificItemByIdVars>(
    PUBLIC_SPECIFIC_ITEM_BY_ID_QUERY,
    {
      variables: {
        rockpoolItemId,
        chainId
      }
    }
  )

  useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { loading, specificPublicItem: data?.publicRockpoolItem, refetch }
}
