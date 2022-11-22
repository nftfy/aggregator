import { useQuery } from '@apollo/client'
import {
  ListBuyFloorCollectionsQueryData,
  ListBuyFloorCollectionsQueryVars,
  LIST_BUY_FLOOR_COLLECTIONS_BY_ADDRESS_QUERY
} from '../../../graphql/nftfy/rockpool/buyfloor/listBuyFloorCollectionsByAddressQuery'

export function useListBuyFloorCollections(chainId: number, creator: string, collectionAddress: string) {
  const { data, loading, startPolling, stopPolling, refetch } = useQuery<
    ListBuyFloorCollectionsQueryData,
    ListBuyFloorCollectionsQueryVars
  >(LIST_BUY_FLOOR_COLLECTIONS_BY_ADDRESS_QUERY, {
    variables: {
      chainId,
      creator,
      collectionAddress
    },
    onError: errorData => {
      console.error(errorData.networkError, 'Failed to obtain data')
      stopPolling()
    },
    onCompleted: listCollections => {
      if (listCollections.listBuyFloorCollectionsByAddress) {
        startPolling(30000)
      }
    }
  })
  console.log(data?.listBuyFloorCollectionsByAddress)
  return { listBuyFloorCollections: data?.listBuyFloorCollectionsByAddress || [], loading, refetch }
}
