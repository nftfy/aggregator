import { useQuery } from '@apollo/client'
import { FloorCollectionQueryData, FloorCollectionQueryVars, FLOOR_COLLECTION } from '../../../graphql/buyfloor/FloorCollection'
import { code } from '../../../message'

export const useFloorCollection = (chainId: number) => {
  const { data, loading } = useQuery<FloorCollectionQueryData, FloorCollectionQueryVars>(FLOOR_COLLECTION, {
    variables: {
      chainId
    },
    skip: !chainId,
    onError: () => {
      console.error({
        type: 'error',
        text: code[5004],
        duration: 5
      })
    }
  })

  return {
    loading,
    floorCollection: data?.selectedFloorCollections
  }
}
