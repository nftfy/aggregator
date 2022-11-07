import { useReactiveVar } from '@apollo/client'
import { FilterEnum } from '@appTypes/pool/RewardPool'
import { isManagePoolConfirmedVar, selectedMenuItemsVar, stakedOnlyVar } from '@graphql/variables/RewardPoolsVariables'
import { useStakingPools } from '@hook/shared/useStakingPools'
import { Col, Layout, MenuProps, Row } from 'antd'
import { useEffect, useState } from 'react'
import { RewardPoolsOpen } from './RewardPoolsOpen'

type MenuItem = Required<MenuProps>['items'][number]
interface RewardPoolsProps {
  chainId: number
}

const { Content, Sider } = Layout

export function RewardPools({ chainId }: RewardPoolsProps) {
  const walletAccount = '0x7cA2246bC2BB0092285faD93d89325a581323c6a'
  const hasWalletInitialized = true
  const isManagePoolConfirmed = useReactiveVar(isManagePoolConfirmedVar)
  const selectedMenuItems = useReactiveVar(selectedMenuItemsVar)
  const stakedOnly = useReactiveVar(stakedOnlyVar)

  const [statusFilter, setStatusFilter] = useState<FilterEnum>(FilterEnum.all)
  const [collectionFilter, setCollectionFilter] = useState<string | undefined>(undefined)


  const { stakingPools, loading, loadMore, hasMore, refetch, isRefetching } = useStakingPools(
    chainId,
    hasWalletInitialized,
    statusFilter,
    walletAccount,
    collectionFilter ? [collectionFilter] : undefined,
    stakedOnly
  )
  
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

  useEffect(() => {
    const filterCollection = selectedMenuItems.find(item => item.type.includes('collection'))

    if (!filterCollection) {
      return
    }

    if (filterCollection.key === '') {
      setCollectionFilter(undefined)
      return
    }

    setCollectionFilter(filterCollection.key.replace(/collection(_)?/g, ''))
  }, [selectedMenuItems])

  return (
    <Layout>
      <Layout>
        <Layout style={{ paddingLeft: '24px' }}>
          <Content>
            <Row gutter={[12, 24]}>
              <Col span={24}>
                <RewardPoolsOpen
                  chainId={chainId}
                  stakingPools={stakingPools}
                  loading={loading}
                  loadMore={loadMore}
                  hasMore={hasMore}
                  refetch={refetch}
                  isRefetching={isRefetching}
                />
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}