export interface EvmRawTx {
  from: string
  to: string
  data: string
  gasPrice: number
  gas: number
}

export type TransactionStatus = 'standby' | 'success' | 'reverted' | 'pending'
