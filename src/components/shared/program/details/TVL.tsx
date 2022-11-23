import { toHumanFormat } from '@services/UtilService'
import { Space, Typography } from 'antd'

export interface ProgramDetailsTVLProps {
  tvl: {
    amount?: string
  }
}

const { Text, Title } = Typography

export function ProgramDetailsTVL({ tvl }: ProgramDetailsTVLProps) {
  return (
    <Space direction='vertical' size={0}>
      <Text type='secondary'>TVL</Text>
      <Space direction='horizontal' align='start'>
        <Title level={5}>{toHumanFormat(+(tvl.amount || '0'))}</Title>
        <Text type='secondary'>USD</Text>
      </Space>
    </Space>
  )
}

export default ProgramDetailsTVL
