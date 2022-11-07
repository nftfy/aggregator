import { useQuery } from '@apollo/client'
import { CollectionsFilterData, CollectionsFilterVars, COLLECTIONS_FILTER_QUERY } from '@graphql/collection-filter/CollectionsFilterQuery'

export function useCollectionsFilter(chainId: number) {
  const { loading, data, error } = useQuery<CollectionsFilterData, CollectionsFilterVars>(COLLECTIONS_FILTER_QUERY, {
    variables: {
      chainId
    }
  })

  return {
    loading,
    collections: data?.collectionsFilter,
    error
  }
}
