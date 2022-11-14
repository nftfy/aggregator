import { CheckCircleFilled, QuestionOutlined } from '@ant-design/icons'
import { TokenImage } from '@components/shared/TokenImage'
import { Avatar, Col, Row, Space, Typography } from 'antd'

export interface ProgramDetailsSponsorByProps {
  sponsor?: {
    name?: string
    image?: string
    verified?: boolean
  }
  displayVerified?: boolean
  title?: string
}

const { Text, Title } = Typography

export function ProgramDetailsSponsorBy({ sponsor, title, displayVerified = true }: ProgramDetailsSponsorByProps) {
  return (
    <Row>
      {title && (
        <Col span={24}>
          <Text type='secondary'>{title}</Text>
        </Col>
      )}
      <Col span={24}>
        <Space
          direction='horizontal'
          size='small'
          align='center'
          style={{
            display: 'flex'
          }}
        >
          <div>
            {sponsor?.image ? (
              <TokenImage diameter={24} address='' src={sponsor.image} />
            ) : (
              <Avatar size={24} icon={<QuestionOutlined />} />
            )}
          </div>
          <Title level={5}>{sponsor?.name || 'Not defined'}</Title>
          {displayVerified && sponsor?.verified && <CheckCircleFilled style={{ color: 'var(--primary-color)' }} />}
        </Space>
      </Col>
    </Row>
  )
}

export default ProgramDetailsSponsorBy
