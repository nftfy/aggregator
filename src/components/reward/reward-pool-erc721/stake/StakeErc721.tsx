import { CheckOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { RewardPool, StakedItem } from '@appTypes/pool/RewardPool'
import { SelectedNftStake } from '@appTypes/stake/SelectedNftStake'
import { CardTokenContainer } from '@components/shared/card-token/CardTokenContainer'
import { CardTokenImage } from '@components/shared/card-token/CardTokenImage'
import CardLoader from '@components/shared/card/CardLoader'
import { ModalConfirm } from '@components/shared/design-system'
import ExternalLink from '@components/shared/ExternalLink'
import { ListItemNft } from '@components/shared/ListItemNft'
import { chainConfig } from '@config/chain'
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useErc721Collection } from '@hook/erc721/useErc721Collection'
import { useErc721TargetByOwner } from '@hook/erc721/useErc721TargetByOwner'
import { useErc721TokenIdListItems } from '@hook/erc721/useErc721TokenIdListItems'
import { Col, Divider, Empty, Row, Space, Typography } from 'antd'
import { ReactNode, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import styled from 'styled-components'

const { Text } = Typography

interface StakeErc721Props {
  hideInfo?: boolean
  pool: RewardPool
  chainIdPage: number
  account: string
  stakeStatus: boolean
  unlockStatus: boolean
  stakeTokenImage?: string
  isApprovingUnlock: boolean
  isApprovedForAll: boolean
  selectedItems: SelectedNftStake[]
  onConfirm: () => void
  refetchUnlock: () => void
  setSelectedItems: (SelectedNftStake: SelectedNftStake[]) => void
  children?: ReactNode
}

export function StakeErc721({
  pool,
  chainIdPage,
  account,
  stakeStatus,
  stakeTokenImage,
  unlockStatus,
  isApprovingUnlock,
  isApprovedForAll,
  selectedItems = [],
  onConfirm,
  refetchUnlock,
  setSelectedItems,
  children,
  hideInfo
}: StakeErc721Props) {
  const config = chainConfig(chainIdPage)
  const [hasReachedMaxSelection, setHasReachedMaxSelection] = useState(false)
  const [hasLoadedStakedItems, setHasLoadedStakedItems] = useState(false)
  const [isConfirmModalShowing, setIsConfirmModalShowing] = useState(false)
  const [stakedTokenIdList, setStakedTokenIdList] = useState<StakedItem[]>([])
  const { getErc721Collection, erc721Collection } = useErc721Collection()
  const {
    erc721TargetByOwner: walletNfts,
    loading: isLoadingWalletNfts,
    loadMore,
    hasMore,
    refetch: refetchWalletNfts
  } = useErc721TargetByOwner(chainIdPage, pool.token.id, account)
  const {
    execute: obtainStakedNfts,
    erc721TargetByOwner: stakedNfts,
    loading: isLoadingStakedNfts
  } = useErc721TokenIdListItems(
    chainIdPage,
    pool.token.id,
    stakedTokenIdList.map(item => `${item.tokenId || ''}`)
  )

  const handleNftSelection = (tokenId: string, amount: string, image: string) => {
    if (amount === '0') {
      setSelectedItems(selectedItems.filter(item => item.tokenId !== tokenId))

      return
    }
    setSelectedItems(selectedItems.filter(item => item.tokenId !== tokenId).concat({ tokenId, amount, image }))
  }

  const handleConfirmStakeAdded = () => {
    onConfirm()
    setIsConfirmModalShowing(false)
  }

  useEffect(() => {
    if (!pool.hasStake) {
      return
    }

    const myItems = pool.items.filter(item => item.account.id.toLocaleLowerCase() === account.toLocaleLowerCase() && item.tokenId)

    setStakedTokenIdList(myItems)
  }, [account, pool])

  useEffect(() => {
    if (stakedTokenIdList.length === 0 || hasLoadedStakedItems) {
      return
    }

    setHasLoadedStakedItems(true)
    obtainStakedNfts()
  }, [hasLoadedStakedItems, obtainStakedNfts, stakedTokenIdList.length])

  useEffect(() => {
    getErc721Collection({
      variables: {
        erc721Address: pool.token.id,
        chainId: chainIdPage
      }
    })
  }, [chainIdPage, getErc721Collection, pool.token.id])

  useEffect(() => {
    if (stakeStatus && !isLoadingStakedNfts) {
      refetchWalletNfts()
      setIsConfirmModalShowing(true)
    }
  }, [refetchWalletNfts, stakeStatus, isLoadingStakedNfts])

  useEffect(() => {
    if (!isApprovingUnlock && unlockStatus) {
      refetchUnlock()
    }
  }, [isApprovingUnlock, refetchUnlock, unlockStatus])

  useEffect(() => {
    setHasReachedMaxSelection(selectedItems.length >= 5)
  }, [selectedItems])
  return (
    <>
      <div>
        <Row gutter={[0, 24]}>
          {!hideInfo && (
            <>
              <Col span={24}>
                <Text>Stake NFT and earn rewards on it</Text>
              </Col>
              <Col span={24}>
                <Row gutter={[0, 8]}>
                  <Col span={24}>
                    <Text>Collection Info</Text>
                  </Col>
                  <Col span={24}>
                    <Row gutter={[0, 8]}>
                      <CardTokenImage
                        span={12}
                        chainConfig={config}
                        image={stakeTokenImage}
                        token={{
                          address: pool.token.id,
                          ...pool.token
                        }}
                      />
                      <Col span={6}>
                        <Space direction='vertical' size={0}>
                          <Text type='secondary'>Items</Text>
                          <Text strong>{erc721Collection?.stats?.itemsCount || 'N/A'}</Text>
                        </Space>
                      </Col>
                      <Col span={6}>
                        <Space direction='vertical' size={0}>
                          <Text type='secondary'>Owners</Text>
                          <Text strong>{erc721Collection?.stats?.ownersCount || 'N/A'}</Text>
                        </Space>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </>
          )}

          {pool.hasStake && (
            <Col span={24}>
              <Row gutter={[0, 8]}>
                {!hideInfo && (
                  <Col span={24}>
                    <Text>My stake ({stakedTokenIdList.length || 0})</Text>
                  </Col>
                )}
                <Col span={24}>
                  <MyWalletContainer>
                    <Row gutter={[0, 8]}>
                      {isLoadingStakedNfts && (
                        <Col span={24}>
                          <CardLoader />
                        </Col>
                      )}
                      {!!(!isLoadingStakedNfts && stakedTokenIdList.length) &&
                        stakedTokenIdList.map(stakedTokenId => (
                          <Col span={24} key={`${stakedTokenId.id}#${stakedTokenId.tokenId}`}>
                            <ListItemNft
                              image={stakedNfts.find(item => item.tokenId === stakedTokenId.tokenId)?.metadata?.image}
                              token={pool.token}
                              item={{
                                id: pool.token.id,
                                account: { id: stakedTokenId.account.id ?? '' },
                                tokenId: stakedTokenId.tokenId
                              }}
                              type={pool.type}
                              chainId={chainIdPage}
                            />
                          </Col>
                        ))}
                    </Row>
                  </MyWalletContainer>
                </Col>
              </Row>
            </Col>
          )}
        </Row>
        {(!hideInfo || pool?.hasStake) && <Divider plain />}
        <Row gutter={[0, 12]}>
          <Col span={24}>
            <Space size='small'>
              <GrayInfoCircleOutlined />
              <Text type='secondary'>You can select only 5 NFTs per transaction.</Text>
            </Space>
          </Col>
          <Col span={24}>
            {!isLoadingWalletNfts && (
              <Space size='small'>
                <Text>My Wallet</Text>
                <Text>{selectedItems.length || 0}/5</Text>
              </Space>
            )}
          </Col>
          <Col span={24}>
            <InfiniteScrollContainer>
              <InfiniteScroll
                next={loadMore}
                hasMore={hasMore}
                loader={isLoadingWalletNfts && <CardLoader />}
                dataLength={walletNfts.length}
                height='100%'
              >
                <Row gutter={[0, 8]}>
                  {!isLoadingWalletNfts &&
                    walletNfts.length > 0 &&
                    walletNfts.map(item => (
                      <Col span={24} key={`${item.address}#${item.tokenId}`}>
                        <ListItemNft
                          disabled={
                            !isApprovedForAll ||
                            (hasReachedMaxSelection && !selectedItems.find(selectedItem => selectedItem.tokenId === item.tokenId))
                          }
                          image={item.metadata?.image}
                          onChange={(tokenId, amount) => handleNftSelection(tokenId, String(amount), item.metadata?.image || '')}
                          token={pool.token}
                          item={{ id: item.address, account: { id: item.ownerAddress || '' }, tokenId: item.tokenId }}
                          type={pool.type}
                          chainId={chainIdPage}
                        />
                      </Col>
                    ))}
                  {!isLoadingWalletNfts && walletNfts.length === 0 && (
                    <Col span={24}>
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No items in your wallet' />
                    </Col>
                  )}
                </Row>
              </InfiniteScroll>
            </InfiniteScrollContainer>
          </Col>
          {children}
          <Col span={24}>
            <ExternalLink
              href={pool?.offchain?.getMoreTokenUrl || `${config.scanAddress}address/${pool.token.id}`}
              target='_blank'
              rel='noreferrer'
            >
              <Space direction='horizontal' size='small'>
                {`Get ${pool.token.name || 'more tokens'}`}
                <FontAwesomeIcon size='1x' icon={faUpRightFromSquare} />
              </Space>
            </ExternalLink>
          </Col>
        </Row>
      </div>
      <ModalConfirm
        visible={isConfirmModalShowing}
        type='success'
        title='Stake confirmed!'
        onOk={handleConfirmStakeAdded}
        onCancel={handleConfirmStakeAdded}
      >
        <InfiniteScrollContainer>
          <InfiniteScroll next={loadMore} hasMore={false} loader={false} dataLength={selectedItems.length}>
            <Row gutter={[0, 8]}>
              {selectedItems.map(item => (
                <Col span={24} key={`${item.amount}#${item.tokenId}`}>
                  <CardTokenContainer gutter={0}>
                    <CardTokenImage
                      chainConfig={config}
                      image={item.image}
                      native={pool.token.native}
                      token={{
                        ...pool.token,
                        address: pool.token.id,
                        id: item.tokenId
                      }}
                    />
                    <Col>
                      <CheckIcon />
                    </Col>
                  </CardTokenContainer>
                </Col>
              ))}
            </Row>
          </InfiniteScroll>
        </InfiniteScrollContainer>
      </ModalConfirm>
    </>
  )
}

const { InfiniteScrollContainer, MyWalletContainer, GrayInfoCircleOutlined, CheckIcon } = {
  GrayInfoCircleOutlined: styled(InfoCircleOutlined)`
    color: var(--text-color-secondary);
  `,
  CheckIcon: styled(CheckOutlined)`
    color: var(--primary-color);
  `,
  MyWalletContainer: styled.div`
    max-height: 250px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: var(--gray-1);
      border-radius: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--gray-6);
      border-radius: 20px;
    }
  `,

  InfiniteScrollContainer: styled.div`
    max-height: 350px;
    overflow-y: auto;
    > div > .infinite-scroll-component {
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
    }
  `
}
