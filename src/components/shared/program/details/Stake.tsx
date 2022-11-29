import ExternalLink from '@components/shared/ExternalLink'
import { TokenImage } from '@components/shared/TokenImage'
import { Space, Typography } from 'antd'

export interface ProgramDetailsStakeProps {
  showTitle?: boolean
  stake: {
    label?: string
    url: string
    image?: string
    address: string
    loading?: boolean
    diameter?: number
  }
}

const { Text, Title } = Typography

export function ProgramDetailsStake({ stake, showTitle = true }: ProgramDetailsStakeProps) {
  return (
    <Space direction='vertical' size={0}>
      {showTitle && <Text type='secondary'>Stake</Text>}
      <ExternalLink href={stake.url}>
        <Space direction='horizontal'>
          <TokenImage shape='square' diameter={stake.diameter ?? 16} address={stake.address} src={stake.image} loading={stake.loading} />
          <Title level={5}>{stake.label || 'Not defined'}</Title>
        </Space>
      </ExternalLink>
    </Space>
  )
}

export default ProgramDetailsStake
