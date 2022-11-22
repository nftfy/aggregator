import { useReactiveVar } from '@apollo/client'
import { FilterEnum } from '@appTypes/pool/RewardPool'
import { isManagePoolConfirmedVar, selectedMenuItemsVar, stakedOnlyVar } from '@graphql/variables/RewardPoolsVariables'
import { useStakingPools } from '@hook/shared/useStakingPools'
import { Col, Layout, Row } from 'antd'
import { useEffect, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import useMounted from '../../../../hooks/useMounted'
import { RewardPoolsOpen } from './RewardPoolsOpen'

interface RewardPoolsProps {
  chainId: number
  collectionAddress: string
}

const { Content } = Layout

export function RewardPools({ chainId, collectionAddress }: RewardPoolsProps) {
  const account = useAccount()
  const hasWalletInitialized = useMounted()
  const isManagePoolConfirmed = useReactiveVar(isManagePoolConfirmedVar)
  const selectedMenuItems = useReactiveVar(selectedMenuItemsVar)
  const stakedOnly = useReactiveVar(stakedOnlyVar)
  const [statusFilter, setStatusFilter] = useState<FilterEnum>(FilterEnum.all)

  const { stakingPools, loading, loadMore, hasMore, refetch, isRefetching } = useStakingPools(
    chainId,
    hasWalletInitialized,
    statusFilter,
    account?.address,
    [collectionAddress],
    stakedOnly
  )
  const { chain } = useNetwork()
  useEffect(() => {
    if (isManagePoolConfirmed) {
      refetch()
      isManagePoolConfirmedVar(false)

      if (statusFilter !== FilterEnum.created) {
        setStatusFilter(FilterEnum.created)
      }
    }
  }, [statusFilter, refetch, isManagePoolConfirmed])

  useEffect(() => {
    const filterStatus = selectedMenuItems.find(item => item.type.includes('status'))

    if (!filterStatus) {
      return
    }

    if (filterStatus.key === '') {
      setStatusFilter(FilterEnum.all)
      return
    }

    setStatusFilter(filterStatus.key.toLowerCase() as FilterEnum)
  }, [selectedMenuItems])

  return (
    <div className='mt-2  md:m-5 md:gap-4'>
      <Row gutter={[12, 24]}>
        <Col span={24}>
          <RewardPoolsOpen
            chainId={chain?.id ?? chainId}
            stakingPools={stakingPools}
            loading={loading}
            loadMore={loadMore}
            hasMore={hasMore}
            refetch={refetch}
            isRefetching={isRefetching}
          />
        </Col>
      </Row>
    </div>
  )
}
