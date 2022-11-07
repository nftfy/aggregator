import { CheckCircleFilled, QuestionOutlined } from '@ant-design/icons'
import { TokenImage } from '@components/shared/TokenImage'
import { Avatar, Space, Typography } from 'antd'

export interface ProgramDetailsSponsorByProps {
  sponsor?: {
    name?: string
    image?: string
    verified?: boolean
  }
  title?: string
}

const { Text, Title } = Typography

export function ProgramDetailsSponsorBy({ sponsor, title }: ProgramDetailsSponsorByProps) {
  return (
    <Space direction='vertical' size={0}>
      {title && <Text type='secondary'>{title}</Text>}
      <Space direction='horizontal' size='small'>
        {sponsor?.image ? <TokenImage diameter={24} address='' src={sponsor.image} /> : <Avatar size={24} icon={<QuestionOutlined />} />}
        <Title level={5}>{sponsor?.name || 'Not defined'}</Title>
        {sponsor?.verified && <CheckCircleFilled style={{ color: 'var(--primary-color)' }} />}
      </Space>
    </Space>
  )
}

export default ProgramDetailsSponsorBy
