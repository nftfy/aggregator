import { gql } from '@apollo/client'
import { EvmRawTx } from '../../types/EvmRawTx'

export interface HarvestQueryVar {
  chainId: number
  account: string
  poolAddress: string
  rewardToken: string
}

export interface HarvestQueryData {
  harvestTx: EvmRawTx
}

export const HARVEST_TX_MUTATION = gql`
  mutation Harvest($chainId: Int!, $account: String!, $poolAddress: String!, $rewardToken: String!) {
    harvestTx(chainId: $chainId, account: $account, poolAddress: $poolAddress, rewardToken: $rewardToken) {
      from
      to
      data
      gasPrice
      gas
    }
  }
`
