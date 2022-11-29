import { useReactiveVar } from '@apollo/client'
import { FilterEnum } from '@appTypes/pool/RewardPool'
import { isManagePoolConfirmedVar, selectedMenuItemsVar } from '@graphql/variables/RewardPoolsVariables'
import { Col, Row } from 'antd'
import { useEffect, useState } from 'react'
import { useNetwork } from 'wagmi'
import { RewardPool } from '../../../types/pool/RewardPool'
import { RewardPoolsOpen } from './RewardPoolsOpen'

interface RewardPoolsProps {
  chainId: number
  queryPool: {
    stakingPools: RewardPool[]
    loading: boolean
    hasMore: boolean
    isRefetching: boolean
    loadMore: () => Promise<void>
    refetch: () => Promise<void>
  }
}

export function RewardPools({ chainId, queryPool }: RewardPoolsProps) {
  const isManagePoolConfirmed = useReactiveVar(isManagePoolConfirmedVar)
  const selectedMenuItems = useReactiveVar(selectedMenuItemsVar)

  const [statusFilter, setStatusFilter] = useState<FilterEnum>(FilterEnum.all)
  const { stakingPools, loading, loadMore, hasMore, refetch, isRefetching } = queryPool

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
