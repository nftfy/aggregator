import { RewardPool } from '@appTypes/pool/RewardPool'
import CardGrid from '@components/shared/card/CardGrid'
import { Empty } from '@components/shared/Empty'
import { useAccount, useNetwork } from 'wagmi'
import LoadingIcon from '../../../../components/LoadingIcon'
import { RewardPoolERC1155Card } from '../pool-erc1155/RewardPoolERC1155Card'
import { RewardPoolERC721Card } from '../pool-erc721/RewardPoolERC721Card'

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
  const { chain } = useNetwork()
  const resolveRewardPoolCard = (pool: RewardPool) => {
    if (pool.type === 'ERC-721') {
      return (
        <RewardPoolERC721Card
          pool={pool}
          key={pool.id}
          accountAddress={String(account?.address)}
          chainId={chainId}
          walletChainId={chain?.id ?? null}
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
          chainId={chainId}
          walletChainId={chain?.id ?? null}
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
      loader={
        loading && (
          <div className='my-20 flex justify-center'>
            <LoadingIcon />
          </div>
        )
      }
    />
  )
}
