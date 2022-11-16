import { Col, PageHeader, Row } from 'antd'
import { GetServerSideProps } from 'next'
import CollectionFloorPoolDetailPage from '../../../src/components/rockpool/floor/detail/CollectionFloorPoolDetailPage'
import { DefaultPageTemplate } from '../../../src/components/shared/DefaultPageTemplate'
import ShareButton from '../../../src/components/shared/ShareButton'

interface FloorDetailPageProps {
  collectionAddress: string
}

export default function FloorDetailPage({ collectionAddress }: FloorDetailPageProps) {
  const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
  
  return (

      <DefaultPageTemplate title='Buy Floor' product='Rockpool'>
        <Row gutter={[32, 0]}>
          <Col span={24}>
            <PageHeader onBack={() => window.history.back()} title='Buy Floor' extra={[<ShareButton key='1' />]} />
          </Col>
          <Col span={24}>
          <CollectionFloorPoolDetailPage chainId={Number(CHAIN_ID) || 1} collectionAddress={collectionAddress} />
          </Col>
        </Row>
      </DefaultPageTemplate>
 
  )
}

export const getServerSideProps: GetServerSideProps = ctx => {
  const { collectionAddress } = ctx.query

  return Promise.resolve({
    props: {
      collectionAddress: String(collectionAddress)
    }
  })
}
