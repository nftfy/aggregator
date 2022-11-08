import { useQuery } from '@apollo/client'
import {
  Erc721CollectionDetailsQueryData,
  Erc721CollectionDetailsQueryVars,
  ERC721_COLLECTION_DETAILS_QUERY
} from '../../graphql/erc721/Erc721CollectionDetailsQuery'
import { TokenTypeEnum } from '../../models/TokenTypeEnum'

export const useCollectionDetails = (chainId: number, collectionAddress: string, type: TokenTypeEnum, skip = false) => {
  const { data, loading, refetch } = useQuery<Erc721CollectionDetailsQueryData, Erc721CollectionDetailsQueryVars>(
    ERC721_COLLECTION_DETAILS_QUERY,
    {
      variables: {
        chainId,
        collectionAddress,
        type
      },
      skip: !collectionAddress || skip,
      onError: () => {
        console.error({
          type: 'error',
          text: 'error',
          duration: 5
        })
      }
    }
  )

  return {
    loading,
    data: data?.erc721Collection,
    refetch
  }
}
