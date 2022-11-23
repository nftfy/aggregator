import { Card, Col, Row } from 'antd'
import styled from 'styled-components'
import { useAccount } from 'wagmi'
import LoadingIcon from '../../../../../components/LoadingIcon'
import { useItemFloorPrice } from '../../../../hook/rockpool/buyFloor/useItemFloorPrice'
import { usePoolBuyers } from '../../../../hook/rockpool/buyFloor/usePoolBuyers'
import { usePoolId } from '../../../../hook/rockpool/buyFloor/usePoolId'
import { usePoolProgress } from '../../../../hook/rockpool/buyFloor/usePoolProgress'
import { useReservePrice } from '../../../../hook/rockpool/buyFloor/useReservePrice'
import { useCollectionDetails } from '../../../../hook/rockpool/useCollectionDetails'
import { useNativeBalance } from '../../../../hook/useNativeBalance'
import { BuyFloorStatus } from '../../../../models/rockpool/floor/BuyFloorStatusEnum'
import { TokenTypeEnum } from '../../../../models/TokenTypeEnum'
import CollectionInfo from '../../../shared/rockpool/SpecificPoolDetailItem'
import TargetNftCards from '../../detail/TargetNftCards'
import AddedFounds from './buy-floor-card/AddedFounds'
import Participants from './buy-floor-card/Participants'

interface CollectionFloorPoolDetailPageProps {
  collectionAddress: string
  chainId: number
}

export default function CollectionFloorPoolDetailPage({ chainId, collectionAddress }: CollectionFloorPoolDetailPageProps) {
  const { data: collectionData, loading: isLoadingCollectionData } = useCollectionDetails(chainId, collectionAddress, TokenTypeEnum.erc721)
  const account = useAccount()
  const walletAccount = account?.address || ''
  const { itemFloorPrice, refetch: refetchItemFlorPrice, loading: isItemFloorLoading } = useItemFloorPrice(chainId, collectionAddress)
  const { poolData, refetch: refetchPooldata, loading: isPoolIdLoading } = usePoolId(chainId, collectionAddress)
  const { poolProgress, refetch: refetchPoolProgress, loading: isPoolProgressLoading } = usePoolProgress(chainId, poolData?.id)
  const {
    reservePrice,
    refetch: refetchReservePrice,
    loading: isLoadingReservPrice
  } = useReservePrice(chainId, itemFloorPrice?.floorAskPrice?.toString(), poolData?.id)
  const { balance, loading: balanceLoading, refetch: refetchNativeBalance } = useNativeBalance(walletAccount, chainId)
  const { buyers, loading: buyersLoading, refetch: poolBuyersRefetch } = usePoolBuyers(chainId, poolData?.id)
  const verifyLoading = isItemFloorLoading || isPoolIdLoading || isPoolProgressLoading || isLoadingReservPrice || isLoadingCollectionData

  const handleRefetchData = () => {
    refetchItemFlorPrice()
    refetchPooldata()
    refetchPoolProgress()
    refetchReservePrice()
    poolBuyersRefetch()
    refetchNativeBalance()
  }
  return (
    <Row gutter={[24, 20]}>
      {verifyLoading ? (
        <ContainerLoading>
          <LoadingIcon />
        </ContainerLoading>
      ) : (
        <>
          <Col lg={12} span={24}>
            <Row gutter={[0, 20]}>
              <Col span={24}>
                <TargetNftCards
                  chainId={chainId}
                  collectionName={collectionData?.collectionName || ''}
                  targetPrice={itemFloorPrice?.targetPrice || '0'}
                  tokenId={itemFloorPrice?.tokenId || ''}
                  nftImage={itemFloorPrice?.image || ''}
                  poolProgress={Number(poolProgress?.progress || 0)}
                  roundNumber={poolData?.roundNumber}
                  collectionAddress={collectionAddress}
                />
              </Col>
              <Col span={24}>
                {collectionData && (
                  <CollectionInfo
                    chainId={chainId}
                    collection={{
                      id: collectionData.collectionAddress,
                      name: collectionData.collectionName || '',
                      symbol: collectionData.symbol || ''
                    }}
                    reservPriceAfterFractionalization={reservePrice || '0'}
                    fractionName={collectionData.collectionName || ''}
                    fractionSymbol={collectionData.symbol || ''}
                    tokenId={poolData?.id || ''}
                  />
                )}
              </Col>
            </Row>
          </Col>
          <Col lg={12} span={24} style={{ height: '100%' }}>
            <CardAnt title='Buy floor' style={{ width: '100%', height: 564 }} type='inner'>
              <Row gutter={[0, 28]} style={{ padding: '24px 0px 0px' }}>
                <Col span={24}>
                  <AddedFounds
                    refetchData={handleRefetchData}
                    collectionAddress={collectionAddress}
                    poolId={poolData?.id}
                    tokenId={itemFloorPrice?.tokenId || ''}
                    reservePrice={reservePrice}
                    chainId={chainId}
                    targetPrice={itemFloorPrice?.targetPrice}
                    balance={balance}
                    balanceLoading={balanceLoading}
                    remainingAmount={poolProgress?.remainingAmount}
                    poolProgressStatus={poolProgress?.status || BuyFloorStatus.ENDED}
                    userParticipation={buyers.find(buyer => buyer.buyer.toLocaleLowerCase() === walletAccount?.toLocaleLowerCase())?.amount}
                    walletAccount={walletAccount}
                  />
                </Col>
                <Col span={24}>
                  {![BuyFloorStatus.ENDED, BuyFloorStatus.NO_ITEM_AVAILABLE].includes(poolProgress?.status || BuyFloorStatus.ENDED) &&
                    !buyersLoading && (
                      <Participants
                        buyers={buyers}
                        buyersLoading={buyersLoading}
                        poolProgress={Number(poolProgress?.progress || 0)}
                        chainId={chainId}
                        walletAddress={walletAccount}
                      />
                    )}
                  {buyersLoading && (
                    <div>
                      <ContainerBuyerLoading>
                        <LoadingIcon />
                      </ContainerBuyerLoading>
                    </div>
                  )}
                </Col>
              </Row>
            </CardAnt>
          </Col>
        </>
      )}
    </Row>
  )
}

const { CardAnt, ContainerLoading, ContainerBuyerLoading } = {
  CardAnt: styled(Card)`
    .ant-card-head {
      height: 51px;
    }
  `,
  ContainerLoading: styled.div`
    width: 100%;
    height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  ContainerBuyerLoading: styled.div`
    width: 100%;
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
  `
}
