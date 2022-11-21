import { useQuery } from '@apollo/client'
import {
  ListBuyFloorCollectionsQueryData,
  ListBuyFloorCollectionsQueryVars,
  LIST_BUY_FLOOR_COLLECTIONS_QUERY
} from '../../../graphql/nftfy/rockpool/buyfloor/listBuyFloorCollectionsQuery'

export function useListBuyFloorCollections(chainId: number, creator: string) {
  const { data, loading, startPolling, stopPolling, refetch } = useQuery<
    ListBuyFloorCollectionsQueryData,
    ListBuyFloorCollectionsQueryVars
  >(LIST_BUY_FLOOR_COLLECTIONS_QUERY, {
    variables: {
      chainId,
      creator
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onError: errorData => {
      console.error(errorData.networkError, 'Failed to obtain data')
      stopPolling()
    },
    onCompleted: listCollections => {
      if (listCollections.listBuyFloorCollections) {
        startPolling(30000)
      }
    }
  })
  return { listBuyFloorCollections: data?.listBuyFloorCollections || [], loading, refetch }
}
