import { Col, ColProps, Grid, Space, Typography } from 'antd'
import { toHumanFormat } from '../../../services/UtilService'
import { ChainConfig } from '../../../types/config/ChainConfig'

const { Text } = Typography

const { useBreakpoint } = Grid

type Token = {
  name?: string
  symbol?: string
  address: string
}

interface CardTokenBalanceProps extends ColProps {
  title: string
  token: Token
  native?: boolean
  amount: string
  showBalanceSymbol?: boolean
  chainConfig: ChainConfig
}

export function CardTokenBalance({
  token,
  amount,
  title,
  native,
  chainConfig,
  showBalanceSymbol = true,
  ...colProps
}: CardTokenBalanceProps) {
  const screens = useBreakpoint()
  const isSmallDevices = (screens.xs || screens.sm) && !screens.md && !screens.lg
  return (
    <Col {...colProps}>
      <Space
        align={isSmallDevices ? 'end' : 'center'}
        direction={isSmallDevices ? 'vertical' : 'horizontal'}
        size={isSmallDevices ? 0 : 'small'}
        wrap
      >
        <Text type='secondary'>{title}</Text>
        <Space size={4}>
          <Text strong>{toHumanFormat(+amount)}</Text>
          {showBalanceSymbol && <Text type='secondary'>{native ? chainConfig.nativeToken.symbol : token?.symbol || token?.name}</Text>}
        </Space>
      </Space>
    </Col>
  )
}

export default CardTokenBalance
