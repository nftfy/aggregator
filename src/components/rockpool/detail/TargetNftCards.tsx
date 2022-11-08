import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import { Card, Col, Progress, Row, Tag, Typography } from 'antd'
import styled from 'styled-components'
import { chainConfig } from '../../../ChainConfig'
import { useExchangeQuote } from '../../../hook/exchange/useQuoteExchange'
import { formatToLocaleString } from '../../../services/UtilService'
import { TokenImage } from '../../shared/TokenImage'

interface NftCardInfoProps {
  chainId: number
  collectionName: string
  targetPrice: string
  tokenId: string
  nftImage: string
  poolProgress: number
  roundNumber?: number
  winningPool?: boolean
  losePool?: boolean
  collectionAddress: string
}

export default function TargetNftCards({
  collectionName,
  targetPrice,
  nftImage,
  tokenId,
  chainId,
  poolProgress,
  roundNumber,
  winningPool,
  losePool,
  collectionAddress
}: NftCardInfoProps) {
  const name = collectionName.length > 12 ? `${collectionName?.slice(0, 12)}...` : collectionName
  const titleCard = `Target NFT: ${name} #${tokenId || 'No floor available'}`
  const progress = winningPool ? 100 : Number(poolProgress?.toFixed(2)) || 0
  const config = chainConfig(chainId)

  const { priceDollar } = useExchangeQuote({
    amount: targetPrice,
    chainId
  })
  const { Text } = Typography
  return (
    <Card
      title={titleCard}
      extra={roundNumber && <Tag style={{ marginRight: 0 }} color='magenta'>{`Round: ${roundNumber || 0}`}</Tag>}
      style={{ width: '100%', height: 220 }}
      type='inner'
    >
      <Row gutter={[23, 0]}>
        <Col span={24}>
          <ContainerInfo>
            <a
              href={`${config.openSeaUrl}assets/${config.name.toLowerCase()}/${collectionAddress}/${tokenId}`}
              target='_blank'
              rel='noreferrer'
            >
              <TokenImage src={nftImage} address={tokenId || ''} diameter={96} shape='square' />
            </a>
            <div>
              <Text strong>Target Price</Text>
              <Typography.Title level={2} style={{ margin: 0 }}>
                {`${formatToLocaleString(targetPrice, 2) || '0'} ETH`}
              </Typography.Title>
              <Text type='secondary'>${priceDollar}</Text>
            </div>
          </ContainerInfo>
        </Col>
        <Col span={24}>
          {progress < 100 && !winningPool && !losePool && (
            <ProgressInfo>
              <Progress percent={progress} showInfo={false} />
              <Text type='secondary'>{progress}%</Text>
            </ProgressInfo>
          )}
          {(progress === 100 || winningPool) && (
            <ProgressIcon>
              <Progress percent={100} showInfo={false} status='success' />
              <CheckCircleFilled style={{ fontSize: '14px', color: '#52c41a', lineHeight: 2 }} />
            </ProgressIcon>
          )}
          {losePool && (
            <ProgressIcon>
              <Progress percent={progress} showInfo={false} status='exception' />
              <CloseCircleFilled style={{ fontSize: '14px', color: '#ff4d4f', lineHeight: 2 }} />
            </ProgressIcon>
          )}
        </Col>
      </Row>
    </Card>
  )
}

const { ContainerInfo, ProgressInfo, ProgressIcon } = {
  ContainerInfo: styled.div`
    width: 100%;
    height: 100px;
    display: flex;
    > div:nth-child(2) {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
    }
  `,
  ProgressInfo: styled.div`
    width: 100%;
    height: auto;
    display: grid;
    grid-template-columns: 12fr 1fr;
    grid-column-gap: 6px;
    justify-items: end;
    margin-top: 6px;
  `,
  ProgressIcon: styled.div`
    width: 100%;
    height: auto;
    display: grid;
    grid-template-columns: 25fr 1fr;
    grid-column-gap: 6px;
    justify-items: end;
    margin-top: 6px;
  `
}
