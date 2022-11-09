import { RewardPool } from '@appTypes/pool/RewardPool'
import CardGrid from '@components/shared/card/CardGrid'
import CardLoader from '@components/shared/card/CardLoader'
import { Empty } from '@components/shared/Empty'
import { useAccount, useSigner } from 'wagmi'
import { RewardPoolERC1155Card } from '../reward-pool-erc1155/RewardPoolERC1155Card'
import { RewardPoolERC721Card } from '../reward-pool-erc721/RewardPoolERC721Card'

interface RewardPoolsOpenProps {
  chainId: number
  stakingPools: RewardPool[]
  loading: boolean
  loadMore: () => Promise<void>
  hasMore: boolean
  refetch: () => Promise<void>
  isRefetching: boolean
}

export function RewardPoolsOpen({ chainId, stakingPools, loading, loadMore, hasMore, refetch, isRefetching }: RewardPoolsOpenProps) {
  const account = useAccount()
  const { data } = useSigner()
  console.log('signer', data?.provider)
  const walletChainId = 5
  const resolveRewardPoolCard = (pool: RewardPool) => {
    if (pool.type === 'ERC-721') {
      return (
        <RewardPoolERC721Card
          pool={pool}
          key={pool.id}
          accountAddress={String(account?.address)}
          signerProvider={null}
          chainId={chainId}
          walletChainId={walletChainId}
          loading={isRefetching}
          refetchStakingPoolList={refetch}
        />
      )
    }

    if (pool.type === 'ERC-1155') {
      return (
        <RewardPoolERC1155Card
          pool={pool}
          key={pool.id}
          accountAddress={String(account?.address)}
          signerProvider={null}
          chainId={chainId}
          walletChainId={walletChainId}
          loading={isRefetching}
          refetchStakingPoolList={refetch}
        />
      )
    }
  }

  return !loading && !stakingPools?.length ? (
    <Empty />
  ) : (
    <CardGrid
      key='items'
      data={stakingPools.map(pool => resolveRewardPoolCard(pool))}
      hasMore={hasMore}
      loadMore={loadMore}
      loader={loading && <CardLoader />}
    />
  )
}
