import { LinkOutlined } from '@ant-design/icons'
import { useCollections } from '@reservoir0x/reservoir-kit-ui'
import { Card, Col, Row, Typography } from 'antd'
import styled from 'styled-components'
import { chainConfig } from '../../../ChainConfig'
import { Collection } from '../../../models/rockpool/Collection'
import { TokenImage } from '../../shared/TokenImage'

export interface CollectionInfoProps {
  chainId: number
  reservPriceAfterFractionalization: string
  collection: Collection
  fractionName: string
  fractionSymbol: string
  tokenId: string
}

export default function CollectionInfo({
  chainId,
  collection,
  fractionName,
  fractionSymbol,
  reservPriceAfterFractionalization,
  tokenId
}: CollectionInfoProps) {
  const { Text } = Typography
  const { openSeaUrl, name } = chainConfig(chainId)

  const collectionData = useCollections({ id: collection.id })
  const collectionInfo = collectionData.data && collectionData.data[0] ? collectionData.data[0] : undefined

  return (
    <Row gutter={[0, 20]}>
      <Col span={24}>
        <Card style={{ width: '100%', height: 99 }}>
          <ContainerCollection>
            <a
              href={
                collectionInfo?.slug
                  ? `${openSeaUrl}collection/${collectionInfo?.slug || ''}`
                  : `${openSeaUrl}assets/${name.toLowerCase()}/${collection.id.toLowerCase()}/${tokenId}`
              }
              target='_blank'
              rel='noreferrer'
            >
              <TokenImage src={collectionInfo?.image} address={collection.id} shape='square' diameter={48} />
            </a>
            <div>
              <Text strong>Collection</Text>
              <CollectionNameContainer>
                <a
                  href={
                    collectionInfo?.slug
                      ? `${openSeaUrl}collection/${collectionInfo?.slug || ''}`
                      : `${openSeaUrl}assets/${name.toLowerCase()}/${collection.id.toLowerCase()}/${tokenId}`
                  }
                  target='_blank'
                  rel='noreferrer'
                >
                  <Text type='secondary'>{collection.name}</Text>
                </a>
                <a
                  key='list-loadmore-edit'
                  href={
                    collectionInfo?.slug
                      ? `${openSeaUrl}collection/${collectionInfo?.slug || ''}`
                      : `${openSeaUrl}/assets/${name.toLowerCase()}/${collection.id.toLowerCase()}/${tokenId}`
                  }
                  target='_blank'
                  rel='noreferrer'
                >
                  <LinkOutlined style={{ fontSize: '14px' }} />
                </a>
              </CollectionNameContainer>
            </div>
          </ContainerCollection>
        </Card>
      </Col>
      <Col span={24}>
        <Card style={{ width: '100%', height: 205 }}>
          <ContainerInfos>
            <div>
              <Text strong>Fraction Name</Text>
              <Text type='secondary'>{fractionName}</Text>
            </div>
            <div>
              <Text strong>Fraction Symbol</Text>
              <Text type='secondary'>{fractionSymbol}</Text>
            </div>
            <div>
              <Text strong>Reserve Price After Fractionalization</Text>
              {reservPriceAfterFractionalization ? (
                <Text type='success'>{`${reservPriceAfterFractionalization} ETH`}</Text>
              ) : (
                <Text type='secondary'>N/A</Text>
              )}
            </div>
            <div>
              <Text strong>NFTFY Fee</Text>
              <Text type='secondary'>5%</Text>
            </div>
          </ContainerInfos>
        </Card>
      </Col>
    </Row>
  )
}

const { ContainerCollection, ContainerInfos, CollectionNameContainer } = {
  ContainerCollection: styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 24px;
    > div {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
  `,
  ContainerInfos: styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 78px;
    row-gap: 24px;
    column-gap: 24px;
    > div {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
  `,
  CollectionNameContainer: styled.div`
    width: 100%;
    display: flex;
    gap: 8px;
  `
}
