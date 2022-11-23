import { UserOutlined } from '@ant-design/icons'
import { Space, Typography } from 'antd'

const { Text } = Typography

interface ProgramDetailsParticipantsProps {
  count?: number
}

export function ProgramDetailsParticipants({ count = 0 }: ProgramDetailsParticipantsProps) {
  return (
    <Space direction='horizontal'>
      <UserOutlined style={{ color: 'var(--primary-color)' }} />
      <Text>{count}</Text>
    </Space>
  )
}

export default ProgramDetailsParticipants
