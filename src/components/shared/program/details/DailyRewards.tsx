import { toHumanFormat } from '@services/UtilService'
import { Space, Typography } from 'antd'

export interface ProgramDetailsDailyRewardsProps {
  showTitle?: boolean
  dailyRewards: {
    amount?: string
    label?: string
  }
}

const { Text, Title } = Typography

export function ProgramDetailsDailyRewards({ showTitle = true, dailyRewards }: ProgramDetailsDailyRewardsProps) {
  return (
    <Space direction='vertical' size={0}>
      {showTitle && <Text type='secondary'>Daily Rewards</Text>}
      <Space direction='horizontal' align='start'>
        <Title level={5}>{toHumanFormat(+(dailyRewards.amount || '0'))}</Title>
        <Text type='secondary'>{dailyRewards.label || 'Not defined'}</Text>
      </Space>
    </Space>
  )
}

export default ProgramDetailsDailyRewards
