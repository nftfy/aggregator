import { Card, Col, Row } from 'antd'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useAccount } from 'wagmi'
import LoadingIcon from '../../../../components/LoadingIcon'
import { chainConfig } from '../../../ChainConfig'
import { useSpecificItemBuyers } from '../../../hook/rockpool/specific/useSpecificItemBuyers'
import { useRockpoolItemBuyer } from '../../../hook/rockpool/specific/useSpecificPoolItemBuyer'
import { useSpecificPublicItemById } from '../../../hook/rockpool/specific/useSpecificPublicItemById'
import { useErc20Balance } from '../../../hook/useErc20Balance'
import { useNativeBalance } from '../../../hook/useNativeBalance'
import { RockpoolStatus } from '../../../models/rockpool/SpecificPoolsTypes'
import { formatToLocaleString } from '../../../services/UtilService'
import AddedParticipants from './Participants/AddedParticipation'

import CollectionInfo from '../../shared/rockpool/SpecificPoolDetailItem'
import SpecificParticipants from './Participants/SpecificParticipants'
import TargetNftCards from './TargetNftCards'
import WinningPool from './WinningPool'

interface SpecificPoolComponentProps {
  specificPoolId: string
  chainId: number
}

export default function SpecificPoolComponent({ chainId, specificPoolId }: SpecificPoolComponentProps) {
  const account = useAccount()
  const walletAccount = account?.address || ''
  const config = chainConfig(chainId)
  const { loading, specificPublicItem, refetch: refetchSpecificPublicItemById } = useSpecificPublicItemById(specificPoolId, chainId)
  // useSpecificVerifyAvailability(chainId, signerProvider, specificPublicItem)
  const priceAfterFractionalization = new BigNumber(specificPublicItem?.targetPrice || 0).multipliedBy(
    specificPublicItem?.priceMultiplier || 0
  )
  const { balance: balanceNative, loading: balanceLoading, refetch: refetchNativeBalance } = useNativeBalance(walletAccount, chainId)
  const {
    erc20Balance: balanceErc20,
    loading: erc20Loading,
    refetch: refetchErc20
  } = useErc20Balance(chainId, walletAccount, specificPublicItem?.paymentToken?.id || '', specificPublicItem?.paymentToken?.decimals || 0)
  const { specificBuyersItem, loading: buyersLoading, refetch: refetchSpecificBuyers } = useSpecificItemBuyers(chainId, specificPoolId)
  const { rockpoolItemBuyer, refetch: refetchBuyer } = useRockpoolItemBuyer(walletAccount, specificPoolId, chainId)

  const isNativeToken = specificPublicItem?.paymentToken?.id === config.nativeToken.address

  const isFractionalized = specificPublicItem?.fractions
  const losePool = specificPublicItem && !loading && !isFractionalized && !specificPublicItem.isErc721Available
  const winningPool = !loading && specificPublicItem && specificPublicItem.status === RockpoolStatus.ENDED && isFractionalized

  const handleRefetchData = () => {
    refetchSpecificPublicItemById()
    refetchNativeBalance()
    refetchErc20()
    refetchSpecificBuyers()
    refetchBuyer()
  }

  return (
    <Row gutter={[24, 20]}>
      {loading ? (
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
                  collectionName={specificPublicItem?.target?.collection?.name || ''}
                  targetPrice={specificPublicItem?.targetPrice || '0'}
                  tokenId={specificPublicItem?.target.tokenId || ''}
                  nftImage={specificPublicItem?.target.metadata.image || ''}
                  poolProgress={Number(specificPublicItem?.poolProgress || 0)}
                  winningPool={!!winningPool}
                  losePool={!!losePool}
                  collectionAddress={specificPublicItem?.target.collection.id || ''}
                />
              </Col>
              <Col span={24}>
                {specificPublicItem && (
                  <CollectionInfo
                    chainId={chainId}
                    collection={specificPublicItem.target.collection}
                    fractionName={specificPublicItem.name}
                    fractionSymbol={specificPublicItem.symbol.toUpperCase()}
                    reservPriceAfterFractionalization={formatToLocaleString(priceAfterFractionalization)}
                    tokenId={specificPublicItem.target.tokenId}
                  />
                )}
              </Col>
            </Row>
          </Col>
          <Col lg={12} span={24} style={{ height: '100%' }}>
            <Card title='Participants' style={{ width: '100%', height: 564 }} type='inner'>
              <Row gutter={[0, 28]} style={{ padding: '24px 0px 0px' }}>
                <Col span={24}>
                  {specificPublicItem && (
                    <AddedParticipants
                      chainId={chainId}
                      refetchData={handleRefetchData}
                      balance={isNativeToken ? balanceNative : balanceErc20}
                      balanceLoading={isNativeToken ? balanceLoading : erc20Loading}
                      specificPublicItem={specificPublicItem}
                      userParticipation={rockpoolItemBuyer?.amount || '0'}
                      walletAddress={walletAccount}
                      losePool={!!losePool}
                      winningPool={!!winningPool}
                    />
                  )}
                  {!!winningPool && (
                    <WinningPool
                      walletAddress={walletAccount}
                      chainId={chainId}
                      userBuyer={rockpoolItemBuyer}
                      specificPublicItem={specificPublicItem}
                      refetch={handleRefetchData}
                    />
                  )}
                </Col>
                <Col span={24}>
                  <SpecificParticipants
                    walletAddress={walletAccount}
                    buyersTotal={specificPublicItem?.buyersCount || 0}
                    buyers={specificBuyersItem || []}
                    chainId={chainId}
                    buyersLoading={buyersLoading}
                    poolProgress={Number(specificPublicItem?.poolProgress || 0)}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </>
      )}
    </Row>
  )
}

const { ContainerLoading } = {
  ContainerLoading: styled.div`
    width: 100%;
    height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
  `
}
