import { gql } from '@apollo/client'

interface Block {
  number: number
}

interface Meta {
  block: Block
}

export interface GetCurrentBlockQueryData {
  _meta: Meta
}

export const GET_CURRENT_BLOCK_QUERY = gql`
  query {
    _meta {
      block {
        hash
        number
      }
    }
  }
`
