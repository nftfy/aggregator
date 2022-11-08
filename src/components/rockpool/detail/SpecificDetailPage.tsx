import { Col, PageHeader, Row } from 'antd'
import styled from 'styled-components'
import ShareButton from '../../shared/ShareButton'
import SpecificPoolComponent from './SpecificPoolComponent'

export interface DetailPageComponentProps {
  chainId: number
  specificPoolId: string
}

export default function SpecificDetailPage({ chainId, specificPoolId }: DetailPageComponentProps) {
  return (
    <>
      <Container>
        <Row gutter={[32, 0]}>
          <Col span={24}>
            <PageHeader onBack={() => window.history.back()} title='Specific' extra={[<ShareButton key='1' />]} />
          </Col>
          <Col span={24}>
            <SpecificPoolComponent chainId={chainId} specificPoolId={specificPoolId} />
          </Col>
        </Row>
      </Container>
    </>
  )
}

const { Container } = {
  Container: styled.div`
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
  `
}
