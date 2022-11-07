import { useReactiveVar } from '@apollo/client'
import CardGrid from '@components/shared/card/CardGrid'
import { Empty } from '@components/shared/Empty'
import { walletAccountVar, walletChainIdVar } from '@nftfyorg/wallet'
import { RewardPool } from '../../types/pool/RewardPool'
import { RewardPoolOwnerCard } from '../reward-pool-owner/RewardPoolOwnerCard'
import CardLoader from '../shared/card/CardLoader'

interface RewardPoolsCreatedProps {
  chainId: number
  stakingPools: RewardPool[]
  loading: boolean
  loadMore: () => Promise<void>
  refetch: () => Promise<void>
  hasMore: boolean
}

export function RewardPoolsCreated({ chainId, stakingPools, loading, loadMore, hasMore, refetch }: RewardPoolsCreatedProps) {
  const walletAccount = useReactiveVar(walletAccountVar)
  const walletChainId = useReactiveVar(walletChainIdVar)

  return !loading && !stakingPools.length ? (
    <Empty />
  ) : (
    <CardGrid
      key='items'
      data={stakingPools.map(pool => (
        <RewardPoolOwnerCard
          key={pool.id}
          accountAddress={walletAccount}
          walletChainId={walletChainId}
          chainId={chainId}
          pool={pool}
          refetchPools={refetch}
        />
      ))}
      hasMore={hasMore}
      loadMore={loadMore}
      loader={loading && <CardLoader />}
    />
  )
}
