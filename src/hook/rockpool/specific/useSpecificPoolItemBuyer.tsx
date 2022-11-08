import { useQuery } from '@apollo/client'
import {
  SpecificItemBuyerData,
  SpecificItemBuyerVars,
  SPECIFIC_ITEM_BUYER_QUERY
} from '../../../graphql/nftfy/rockpool/SpecificPoolItemBuyer'

export const useRockpoolItemBuyer = (accountAddress: string | undefined, rockpoolItemId: string, chainId: number) => {
  const { loading, data, error, refetch } = useQuery<SpecificItemBuyerData, SpecificItemBuyerVars>(SPECIFIC_ITEM_BUYER_QUERY, {
    variables: {
      accountAddress: accountAddress?.toLocaleLowerCase() || '',
      rockpoolItemId,
      chainId
    },
    skip: !accountAddress,
    onError: () => {
      console.error({
        type: 'error',
        text: 'error',
        duration: 5
      })
    }
  })

  return {
    loading,
    rockpoolItemBuyer: data?.rockpoolItemBuyer,
    error,
    refetch
  }
}
