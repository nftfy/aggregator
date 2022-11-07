import { CheckOutlined } from '@ant-design/icons'
import { Checkbox, Col, InputNumber, Row, Space, Typography } from 'antd'
import BigNumber from 'bignumber.js'
import { useCallback, useState } from 'react'
import styled from 'styled-components'
import { chainConfig } from '../../ChainConfig'
import { toHumanFormat } from '../../services/UtilService'
import { PoolType, StakedItem, Token } from '../../types/pool/RewardPool'
import { CardTokenContainer } from './card-token/CardTokenContainer'
import { CardTokenImage } from './card-token/CardTokenImage'

const { Text } = Typography

interface ItemWalletStakeModalProps {
  type: PoolType
  item: StakedItem
  image?: string
  token: Token
  chainId: number
  disabled?: boolean
  onChange?: (tokenId: string, amount: number) => void | Promise<void>
}

export function ListItemNft({ token, item, type, onChange, chainId, image, disabled }: ItemWalletStakeModalProps) {
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const config = chainConfig(chainId)

  const handleSelectErc721 = useCallback(() => {
    if (!item.tokenId) {
      return
    }
    const isAuxChecked = isChecked
    setIsChecked(!isAuxChecked)
    if (onChange) {
      onChange(item.tokenId, !isAuxChecked ? 1 : 0)
    }
  }, [isChecked, item.tokenId, onChange])

  const handleSelectErc1155 = useCallback(
    (amount1155: number) => {
      if (!item.tokenId) {
        return
      }
      if (onChange) {
        onChange(item.tokenId, amount1155)
      }
    },
    [item.tokenId, onChange]
  )
  return (
    <CardTokenContainer gutter={[0, 8]}>
      <CardTokenImage
        xs={type === 'ERC-721' ? 20 : 24}
        md={12}
        token={{
          ...token,
          address: token.id,
          id: item.tokenId
        }}
        chainConfig={config}
        image={image}
        native={token.native}
      />
      {type === 'ERC-1155' && item.amount && (
        <Col xs={24} lg={12}>
          <Row gutter={[16, 0]}>
            <Col span={10}>
              <Space wrap size={0} direction='vertical'>
                <Text type='secondary'>Available</Text>
                <Text strong>{toHumanFormat(new BigNumber(item.amount).toNumber())}</Text>
              </Space>
            </Col>
            <Col span={14}>
              <Input
                disabled={disabled}
                onChange={value => handleSelectErc1155(value as number)}
                size='large'
                max={Number(item.amount)}
                defaultValue={0}
                min={0}
              />
            </Col>
          </Row>
        </Col>
      )}
      {type === 'ERC-721' && (
        <Col xs={4} lg={12}>
          <Row align='middle' justify='end'>
            {onChange && (
              <Checkbox disabled={disabled} checked={isChecked} defaultChecked={isChecked} onChange={() => handleSelectErc721()} />
            )}
            {!onChange && <CheckIcon />}
          </Row>
        </Col>
      )}
    </CardTokenContainer>
  )
}

const { Input, CheckIcon } = {
  CheckIcon: styled(CheckOutlined)`
    color: var(--primary-color);
  `,
  Input: styled(InputNumber)`
    width: 100%;
  `
}
