export enum PoolStatus {
  COLLECTION_ADDRESS_PENDING,
  REWARD_ADDRESS_PENDING,
  DAILY_REWARD_PENDING,
  POOL_COMPLETE
}

interface Account {
  id: string
}

export interface StakedItem {
  id: string
  account: Account
  image?: string
  tokenId?: string
  amount?: string
}

export interface Token {
  id: string
  name?: string
  symbol?: string
  native: boolean
  decimals: number
}

export interface Expiration {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export interface Reward {
  rewardPerSec: string
  token: Token
  dailyRewards: string
  progress: number
  expirationInfo: Expiration
}

export type PoolType = 'ERC-721' | 'ERC-20' | 'ERC-1155' | 'native'
export type FilterType = FilterEnum.closed | FilterEnum.open | FilterEnum.created

export enum FilterEnum {
  all = 'all',
  open = 'open',
  closed = 'closed',
  created = 'created'
}

export interface RewardPoolSponsor {
  image?: string
  name?: string
  verified?: boolean
}

export interface RewardPoolOffChain {
  coverImage?: string
  detailsImage?: string
  stakeTokenImage?: string
  earnTokenImage?: string
  sponsor?: RewardPoolSponsor
  description: string
  discord?: string
  twitter?: string
  website?: string
  telegram?: string
  name: string
  getMoreTokenUrl?: string
}

export interface RewardPool {
  id: string
  address: string
  amount: string
  userCount: number
  hasStake: boolean
  items: StakedItem[]
  token: Token
  rewards: Reward[]
  type: PoolType
  owner: Account
  offchain?: RewardPoolOffChain
}

export interface RewardPoolsProps {
  chainId: number
  loading: boolean
  loadMore: () => void
  hasMore: boolean
  refetch: () => void
  getStakingPools: (filter: string) => Promise<void>
  stakingPools: RewardPool[]
  isRefetching: boolean
}
