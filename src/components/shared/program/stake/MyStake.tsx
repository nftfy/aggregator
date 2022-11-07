import { toHumanFormat } from '@services/UtilService'
import { Button, Col, Row, Space, Typography } from 'antd'
import BigNumber from 'bignumber.js'

interface ProgramStakeMyStakeProps {
  amount?: string
  symbol?: string
  hideAddButton?: boolean
  onUnstake(): void
  onAdd?(): void
  isExpired?: boolean
}

const { Text, Title } = Typography

export function ProgramStakeMyStake({ onAdd, onUnstake, amount, symbol, isExpired, hideAddButton }: ProgramStakeMyStakeProps) {
  const amountBigNumber = new BigNumber(amount ?? 0)
  const hasStake = amountBigNumber.isGreaterThan('0')
  const formattedAmount = toHumanFormat(amountBigNumber.toNumber())

  return (
    <Row gutter={0}>
      <Col span={24}>
        <Text type='secondary'>My Stake</Text>
      </Col>
      <Col span={24}>
        <Row justify='space-between' align='middle'>
          <Col>
            <Space size={4}>
              <Title level={5}>{formattedAmount}</Title>
              <Text type='secondary'>{symbol}</Text>
            </Space>
          </Col>
          <Col>
            <Row justify='end' align='middle' gutter={[4, 0]}>
              {!isExpired && !hideAddButton && (
                <Col>
                  <Button type='primary' onClick={onAdd}>
                    Add
                  </Button>
                </Col>
              )}
              <Col>
                <Button disabled={!hasStake} onClick={onUnstake}>
                  {isExpired ? 'Remove' : 'Unstake'}
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default ProgramStakeMyStake
