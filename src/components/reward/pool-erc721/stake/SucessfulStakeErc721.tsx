import { CheckOutlined } from '@ant-design/icons'
import { Col, Row } from 'antd'
import styled from 'styled-components'
import { chainConfig } from '../../../../ChainConfig'
import { RewardPool } from '../../../../types/pool/RewardPool'
import { SelectedNftStake } from '../../../../types/stake/SelectedNftStake'
import CardTokenContainer from '../../../shared/card-token/CardTokenContainer'
import CardTokenImage from '../../../shared/card-token/CardTokenImage'
import { ModalConfirm } from '../../../shared/design-system'

interface SucessfullStakeErc721Props {
  chainId: number
  pool: RewardPool
  visible: boolean
  items: SelectedNftStake[]
  onConfirm: () => void
  onCancel: () => void
}

export const SucessfullStakeErc721 = ({ chainId, pool, visible, items, onConfirm, onCancel }: SucessfullStakeErc721Props) => {
  const config = chainConfig(chainId)
  return (
    <ModalConfirm visible={visible} type='success' title='Stake confirmed!' onOk={onConfirm} onCancel={onCancel}>
      <Row gutter={[0, 8]}>
        {items.map(item => (
          <Col span={24} key={`${item.amount}#${item.tokenId}`}>
            <CardTokenContainer gutter={0}>
              <CardTokenImage
                chainConfig={config}
                image={item.image}
                native={pool.token.native}
                token={{
                  ...pool.token,
                  address: pool.token.id,
                  id: item.tokenId
                }}
              />
              <Col>
                <CheckIcon />
              </Col>
            </CardTokenContainer>
          </Col>
        ))}
      </Row>
    </ModalConfirm>
  )
}

const { CheckIcon } = {
  CheckIcon: styled(CheckOutlined)`
    color: var(--primary-color);
  `
}
