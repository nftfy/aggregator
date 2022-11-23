import { Col, PageHeader, Row } from 'antd'
import ShareButton from '../../shared/ShareButton'
import SpecificPoolComponent from './SpecificPoolComponent'

export interface DetailPageComponentProps {
  chainId: number
  specificPoolId: string
}

export default function SpecificDetailPage({ chainId, specificPoolId }: DetailPageComponentProps) {
  return (
    <Row gutter={[32, 0]}>
      <Col span={24}>
        <PageHeader onBack={() => window.history.back()} title='Specific' extra={[<ShareButton key='1' />]} />
      </Col>
      <Col span={24}>
        <SpecificPoolComponent chainId={chainId} specificPoolId={specificPoolId} />
      </Col>
    </Row>
  )
}
