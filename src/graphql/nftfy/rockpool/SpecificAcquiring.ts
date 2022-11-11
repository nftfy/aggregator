import { gql } from '@apollo/client'

export interface SpecificAcquirerDataVars {
  chainId: number
  rockpoolItemAcquiringDataId: string
  creator: string | null
}

export interface SpecificAcquirerData {
  rockpoolItemAcquiringData: {
    chainId: number
    data: string
    rockpoolId: string
  }
}

export const SPECIFIC_ACQUIRING = gql`
  query RockpoolAcquirerData($chainId: Int!, $rockpoolItemAcquiringDataId: String!, $creator: String) {
    rockpoolItemAcquiringData(chainId: $chainId, creator: $creator, id: $rockpoolItemAcquiringDataId) {
      chainId
      data
      rockpoolId
    }
  }
`
