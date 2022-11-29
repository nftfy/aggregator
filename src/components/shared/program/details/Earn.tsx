import { QuestionOutlined } from '@ant-design/icons'
import ExternalLink from '@components/shared/ExternalLink'
import { TokenImage } from '@components/shared/TokenImage'
import { Avatar, Space, Typography } from 'antd'

export interface ProgramDetailsEarnProps {
  title?: string
  showTitle?: boolean
  earn: {
    id?: string
    label?: string
    url?: string
    image?: string
    address?: string
    loading?: boolean
    diameter?: number
  }
}

const { Text, Title } = Typography

export function ProgramDetailsEarn({ earn, title, showTitle = true }: ProgramDetailsEarnProps) {
  const earnTokenLabel = [earn.label || 'Not defined', earn.id && earn.id !== earn.address && `#${earn.id}`].filter(Boolean).join('')

  return (
    <Space direction='vertical' size={0}>
      {showTitle && <Text type='secondary'>{title || 'Earn'}</Text>}
      <ExternalLink href={earn.url || '#'}>
        <Space direction='horizontal'>
          {earn.address ? (
            <TokenImage diameter={earn.diameter ?? 16} address={earn.address} src={earn.image} loading={earn.loading} />
          ) : (
            <Avatar size={earn.diameter ?? 16} icon={<QuestionOutlined />} />
          )}
          <Title level={5}>{earnTokenLabel}</Title>
        </Space>
      </ExternalLink>
    </Space>
  )
}

export default ProgramDetailsEarn
