import { Col, Row } from 'antd'
import { ReactNode } from 'react'

interface RewardPoolDetailsProps {
  info: ReactNode
  detail: ReactNode
  stake: ReactNode
}

export function RewardPoolDetails({ info, detail, stake }: RewardPoolDetailsProps) {
  return (
    <Row gutter={24}>
      <Col span={12}>{info}</Col>
      <Col span={12}>
        <Row gutter={[0, 8]}>
          <Col span={24}>{detail}</Col>
          <Col span={24}>{stake}</Col>
        </Row>
      </Col>
    </Row>
  )
}
