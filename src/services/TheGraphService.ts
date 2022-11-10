import { theGraphClient } from '../graphql/Client'
import { GetCurrentBlockQueryData, GET_CURRENT_BLOCK_QUERY } from '../graphql/nftfy/GetCurrentBlockQuery'

export interface TheGraphService {
  isSynced(blockNumber: number, theGraph: string): Promise<boolean>
}

export function theGraphService(): TheGraphService {
  return {
    async isSynced(blockNumber: number, theGraph: string) {
      const client = theGraphClient(theGraph)

      if (!client) {
        throw new Error('TransactionService: Client not defined!')
      }

      const { data, error } = await client.query<GetCurrentBlockQueryData>({
        query: GET_CURRENT_BLOCK_QUERY
      })

      if (error) {
        throw new Error('TransactionService: error query "GET_CURRENT_BLOCK_QUERY"!')
      }

      if (!data) {
        return false
      }

      return data._meta.block.number >= blockNumber
    }
  }
}
