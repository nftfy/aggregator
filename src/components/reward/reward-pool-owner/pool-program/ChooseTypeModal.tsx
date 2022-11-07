import { QuestionCircleOutlined } from '@ant-design/icons'
import { Button, Modal } from '@components/shared/design-system'
import { Card, Col, Row, Space, Tooltip, Typography } from 'antd'
import styled from 'styled-components'

export enum TokenTypeEnum {
  ERC721 = 'ERC721',
  ERC20 = 'ERC20',
  NATIVE = 'native',
  LP_TOKEN = 'lp_token'
}

interface PoolProgramChooseTypeProps {
  onCancel: () => void
  visible: boolean
  onSelectType: (key: TokenTypeEnum) => void
}

const { Text } = Typography

export function PoolProgramChooseType({ onCancel, visible, onSelectType }: PoolProgramChooseTypeProps) {
  const options = [
    {
      key: TokenTypeEnum.ERC721,
      label: 'Stake NFT',
      tooltip: 'On this program you will ask for your community to stake a NFT and you will give them token ERC20 of rewards',
      enabled: true
    },
    {
      key: TokenTypeEnum.NATIVE,
      label: 'Stake ETH',
      tooltip: 'On this program you will ask for your community to stake a NFT and you will give them token ERC20 of rewards',
      enabled: false
    },
    {
      key: TokenTypeEnum.ERC20,
      label: 'Stake ERC-20',
      tooltip: 'On this program you will ask for your community to stake a NFT and you will give them token ERC20 of rewards',
      enabled: false
    },
    {
      key: TokenTypeEnum.LP_TOKEN,
      label: 'Stake LP Token',
      tooltip: 'On this program you will ask for your community to stake a NFT and you will give them token ERC20 of rewards',
      enabled: false
    }
  ]
  return (
    <Modal title='Create Program' visible={visible} closable onCancel={onCancel} customFooter=''>
      <Space direction='vertical' size={24}>
        <Text>Choose your Rewards Program type:</Text>
        <CustomSpace direction='vertical' size={8}>
          {options.map(option => (
            <Card size='small' key={option.key}>
              <Row justify='space-between' align='middle'>
                <Col span={12}>
                  <Space>
                    <Text strong>{option.label}</Text>
                    <Tooltip placement='topLeft' title={option.tooltip}>
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </Space>
                </Col>
                <Col span={12}>
                  <CustomSpace align='end' direction='vertical'>
                    {option.enabled ? (
                      <Button type='primary' onClick={() => onSelectType(option.key)}>
                        Select
                      </Button>
                    ) : (
                      <Button type='primary' disabled>
                        Coming soon
                      </Button>
                    )}
                  </CustomSpace>
                </Col>
              </Row>
            </Card>
          ))}
        </CustomSpace>
      </Space>
    </Modal>
  )
}

const { CustomSpace } = {
  CustomSpace: styled(Space)`
    width: 100%;
  `
}
