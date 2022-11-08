import { gql } from '@apollo/client'
import { SpecificPoolItem } from '../../../models/rockpool/SpecificPoolsTypes'

export interface PublicSpecificItemByIdVars {
  chainId: number
  rockpoolItemId: string
}

export interface PublicSpecificItemByIdData {
  publicRockpoolItem: SpecificPoolItem
}

export const PUBLIC_SPECIFIC_ITEM_BY_ID_QUERY = gql`
  query PublicRockpoolItem($chainId: Int!, $rockpoolItemId: String!) {
    publicRockpoolItem(chainId: $chainId, id: $rockpoolItemId) {
      chainId
      creator
      description
      timestamp
      listed
      targetPrice
      targetPriceNet
      target {
        tokenId
        metadata {
          description
          image
          name
        }
        id
        collection {
          symbol
          name
          id
        }
        chainId
        boxItemCount
      }
      symbol
      status
      sellerNetAmount
      sellerFeeAmount
      seller
      reservePrice
      priceMultiplier
      paymentToken {
        symbol
        name
        id
        decimals
      }
      name
      lastBuyers {
        ownership
        id
        fractionsCount
        buyer
        amount
      }
      id
      fractionsCount
      fractions
      fee
      buyersCount
      amount
      poolProgress
      isErc721Available
    }
  }
`
