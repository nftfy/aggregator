import { RewardPool, StakedItem } from '@appTypes/pool/RewardPool'
import { CardTokenContainer } from '@components/shared/card-token/CardTokenContainer'
import { CardTokenImage } from '@components/shared/card-token/CardTokenImage'
import CardLoader from '@components/shared/card/CardLoader'
import ExternalLink from '@components/shared/ExternalLink'
import { ListItemNft } from '@components/shared/ListItemNft'
import { chainConfig } from '@config/chain'
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Col, Divider, Empty, Row, Space, Typography } from 'antd'
import { ReactNode, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import styled from 'styled-components'
import { useErc1155Collection } from '../../../../hook/reward/erc1155/useErc1155Collection'
import { useErc1155TargetByOwner } from '../../../../hook/reward/erc1155/useErc1155TargetByOwner'
import { useErc1155TokenIdListItems } from '../../../../hook/reward/erc1155/useErc1155TokenIdListItems'
import { TransactionStatus } from '../../../../types/EvmRawTx'

const { Text } = Typography

interface StakeERC1155Props {
  pool: RewardPool
  chainIdPage: number
  account: string
  stakePoolImage?: string
  status: TransactionStatus
  isApprovedForAll: boolean
  onSelectItem: (tokenId: string, amount: string, image: string) => void
  stakedAmount: string
  hideInfo?: boolean
  children?: ReactNode
}

export function StakeERC1155({
  pool,
  stakePoolImage,
  account,
  chainIdPage,
  status,
  isApprovedForAll,
  onSelectItem,
  stakedAmount,
  children,
  hideInfo
}: StakeERC1155Props) {
  const [stakedTokenIdList, setStakedTokenIdList] = useState<StakedItem[]>([])
  const { erc1155Collection, getErc1155Collection } = useErc1155Collection()
  const config = chainConfig(chainIdPage)

  const {
    erc721TargetByOwner: listMyNftsByCollection,
    loading: isLoadingListNfts,
    loadMore,
    hasMore,
    refetch: refetchListNfts
  } = useErc1155TargetByOwner(chainIdPage, pool.token.id, account)

  const { execute: obtainStakedNfts } = useErc1155TokenIdListItems(
    chainIdPage,
    pool.token.id,
    stakedTokenIdList.map(item => `${item.tokenId || ''}`)
  )

  useEffect(() => {
    if (!pool.hasStake) {
      return
    }

    const myItems = pool.items.filter(item => item.account.id.toLocaleLowerCase() === account.toLocaleLowerCase() && item.tokenId)

    setStakedTokenIdList(myItems)
  }, [account, pool])

  useEffect(() => {
    if (stakedTokenIdList.length === 0) {
      return
    }

    obtainStakedNfts()
  }, [obtainStakedNfts, stakedTokenIdList.length])

  useEffect(() => {
    getErc1155Collection({
      variables: {
        erc1155Address: pool.token.id,
        chainId: chainIdPage
      }
    })
  }, [chainIdPage, getErc1155Collection, pool.token.id])

  useEffect(() => {
    if (status === 'success') {
      refetchListNfts()
    }
  }, [refetchListNfts, status])

  return (
    <>
      <div>
        {!hideInfo && (
          <Row gutter={[0, 24]}>
            <Col span={24}>
              <Text>Stake NFT and earn rewards on it</Text>
            </Col>
            <Col span={24}>
              <Text>NFT Info</Text>
            </Col>
            <Col span={24}>
              <Row gutter={[0, 8]}>
                <CardTokenImage
                  span={12}
                  chainConfig={config}
                  image={stakePoolImage}
                  token={{
                    address: pool.token.id,
                    ...pool.token
                  }}
                />
                <Col span={6}>
                  <Space direction='vertical' size={0}>
                    <Text type='secondary'>Items</Text>
                    <Text strong>{erc1155Collection?.stats?.itemsCount || 'N/A'}</Text>
                  </Space>
                </Col>
                <Col span={6}>
                  <Space direction='vertical' size={0}>
                    <Text type='secondary'>Owners</Text>
                    <Text strong>{erc1155Collection?.stats?.ownersCount || 'N/A'}</Text>
                  </Space>
                </Col>
              </Row>
            </Col>

            <Col span={24}>
              <CardTokenContainer>
                <Space size='small'>
                  <Text type='secondary'>My Stake</Text>
                  <Text strong>{stakedAmount}</Text>
                </Space>
              </CardTokenContainer>
            </Col>
          </Row>
        )}
        {!hideInfo && <Divider plain />}

        <Row gutter={[0, 12]}>
          <Col span={24}>
            <Text type='secondary'>My Wallet</Text>
          </Col>
          <Col span={24}>
            <InfiniteScrollContainer>
              <InfiniteScroll
                next={loadMore}
                hasMore={hasMore}
                loader={isLoadingListNfts && <CardLoader />}
                dataLength={listMyNftsByCollection.length}
                height='100%'
              >
                <Row gutter={[0, 8]}>
                  {!isLoadingListNfts &&
                    listMyNftsByCollection.length > 0 &&
                    listMyNftsByCollection.map(item => (
                      <Col span={24} key={`${item.address}#${item.tokenId}`}>
                        <ListItemNft
                          disabled={!isApprovedForAll}
                          onChange={(tokenId, amount) => onSelectItem(tokenId, String(amount), item.metadata?.image || '')}
                          token={pool.token}
                          item={{
                            id: item.address,
                            account: { id: item.ownerAddress || '' },
                            tokenId: item.tokenId,
                            amount: item.amount
                          }}
                          type={pool.type}
                          chainId={chainIdPage}
                        />
                      </Col>
                    ))}
                  {!isLoadingListNfts && listMyNftsByCollection.length === 0 && (
                    <Col span={24}>
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No items in your wallet' />
                    </Col>
                  )}
                </Row>
              </InfiniteScroll>
            </InfiniteScrollContainer>
          </Col>
          {children}
          {erc1155Collection && (
            <Col span={24}>
              <ExternalLink href={pool?.offchain?.getMoreTokenUrl || `https://opensea.io/collection/${erc1155Collection.slug}`}>
                <Space direction='horizontal' size='small'>
                  {`Get ${erc1155Collection.collectionName || 'more tokens'}`}
                  <FontAwesomeIcon size='1x' icon={faUpRightFromSquare} />
                </Space>
              </ExternalLink>
            </Col>
          )}
        </Row>
      </div>
    </>
  )
}

const { InfiniteScrollContainer } = {
  InfiniteScrollContainer: styled.div`
    max-height: 350px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 12px;
    }

    &::-webkit-scrollbar-track {
      background: var(--gray-6);
      border-radius: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--gray-4);
      border-radius: 20px;
    }
  `
}
