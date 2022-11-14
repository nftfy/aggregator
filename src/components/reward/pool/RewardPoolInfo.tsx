import { GlobalOutlined, TwitterOutlined } from '@ant-design/icons'
import { RewardPoolSponsor } from '@appTypes/pool/RewardPool'
import SponsorBy from '@components/shared/program/details/SponsorBy'
import SocialLink from '@components/shared/SocialLink'
import { faDiscord, faTelegram } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card, Col, Row, Space, Typography } from 'antd'

const { Text } = Typography

type DetailProps = {
  description?: string
  sponsor?: RewardPoolSponsor
  items?: number
  owners?: number
  discord?: string
  telegram?: string
  twitter?: string
  website?: string
}

export default function ProgramInfo({ description, sponsor, items, owners, twitter, discord, telegram, website }: DetailProps) {
  const socialMedias = [
    {
      label: 'Website',
      link: website,
      icon: <GlobalOutlined />
    },
    {
      label: 'Twitter',
      link: twitter,
      icon: <TwitterOutlined />
    },
    {
      label: 'Discord',
      link: discord,
      icon: <FontAwesomeIcon className='anticon' icon={faDiscord} />
    },
    {
      label: 'Telegram',
      link: telegram,
      icon: <FontAwesomeIcon className='anticon' icon={faTelegram} />
    }
  ]

  return (
    <Row gutter={[0, 24]}>
      <Col span={24}>
        <SponsorBy sponsor={sponsor} title='Sponsored by:' />
      </Col>
      {socialMedias.some(social => social.link) && (
        <Col span={24}>
          <Space direction='horizontal' align='center' size='small' wrap>
            {socialMedias.map(
              social =>
                social.link && (
                  <SocialLink key={social.label} socialLink={social.link} icon={social.icon}>
                    {social.label}
                  </SocialLink>
                )
            )}
          </Space>
        </Col>
      )}
      {description && (
        <Col span={24}>
          <Row gutter={[0, 6]}>
            <Col span={24}>
              <Text type='secondary'>About</Text>
            </Col>
            <Col span={24}>
              <Text>{description}</Text>
            </Col>
          </Row>
        </Col>
      )}

      {(sponsor || items || owners) && (
        <Col span={24}>
          <Row gutter={[0, 8]}>
            <Col span={24}>
              <Text type='secondary'>Collection Info</Text>
            </Col>
            <Col span={24}>
              <Card size='small'>
                <Row gutter={[0, 6]} align='middle' justify='center'>
                  <Col span={12}>
                    <SponsorBy sponsor={sponsor} displayVerified={false} />
                  </Col>
                  <Col span={12}>
                    <Row>
                      <Col span={12}>
                        <Space size={0} direction='vertical'>
                          <Text type='secondary'>Items</Text>
                          <Text strong>{items}</Text>
                        </Space>
                      </Col>
                      <Col span={12}>
                        <Space size={0} direction='vertical'>
                          <Text type='secondary'>Owners</Text>
                          <Text strong>{owners}</Text>
                        </Space>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Col>
      )}
    </Row>
  )
}
