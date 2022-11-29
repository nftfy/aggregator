import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Progress, Space, Typography } from 'antd'

const { Text } = Typography

interface ProgramDetailsTimeLeftProps {
  progress?: number
  label: string | string[]
  isExpired?: boolean
}

export function ProgramDetailsTimeLeft({ progress = 0, label, isExpired }: ProgramDetailsTimeLeftProps) {
  return (
    <Space direction='horizontal'>
      {isExpired ? (
        <>
          <ExclamationCircleOutlined style={{ color: 'var(--primary-color)' }} />
          <Text>Finished</Text>
        </>
      ) : (
        <div style={{ width: 200 }}>
          <Progress
            width={16}
            type='circle'
            percent={progress}
            status='normal'
            showInfo={false}
            strokeWidth={16}
            strokeColor='var(--primary-color)'
          />
          <Text>{label}</Text>
        </div>
      )}
    </Space>
  )
}

export default ProgramDetailsTimeLeft
