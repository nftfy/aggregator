import { toHumanFormat } from '@services/UtilService'
import { Button, Col, Row, Space, Typography } from 'antd'
import BigNumber from 'bignumber.js'

interface ProgramStakeMyRewardsProps {
  loading: boolean
  symbol?: string
  amount?: string
  onHarvest(): void
}

const { Text, Title } = Typography

export function ProgramStakeMyRewards({ loading, onHarvest, amount, symbol }: ProgramStakeMyRewardsProps) {
  const amountBigNumber = new BigNumber(amount ?? 0)
  const hasRewards = amountBigNumber.isGreaterThanOrEqualTo('0.00001')
  const formattedAmount = toHumanFormat(amountBigNumber.toNumber())

  return (
    <Row gutter={0}>
      <Col span={24}>
        <Text type='secondary'>My Rewards</Text>
      </Col>
      <Col span={24}>
        <Row justify='space-between'>
          <Space size={4}>
            <Title level={5}>{formattedAmount}</Title>
            <Text type='secondary'>{symbol}</Text>
          </Space>
          <Button disabled={!hasRewards} onClick={onHarvest} loading={loading}>
            Harvest
          </Button>
        </Row>
      </Col>
    </Row>
  )
}

export default ProgramStakeMyRewards
