import { makeVar } from '@apollo/client'
import { RewardPool } from '../../types/pool/RewardPool'

export const unstakeErc20Var = makeVar<RewardPool | undefined>(undefined)
