import { CheckOutlined } from '@ant-design/icons'
import { Col, Row } from 'antd'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { chainConfig } from '../../../../ChainConfig'
import { RewardPool } from '../../../../types/pool/RewardPool'
import { SelectedNftStake } from '../../../../types/stake/SelectedNftStake'
import CardTokenContainer from '../../../shared/card-token/CardTokenContainer'
import CardTokenImage from '../../../shared/card-token/CardTokenImage'
import { ModalConfirm } from '../../../shared/design-system'
import { StakeModal } from './StakeModal'

interface StakeProps {
  pool: RewardPool
  chainIdPage: number

  account: string
  visible: boolean
  refetchPoolList: () => void
  onConfirm: () => void
  onClose?: () => void
}

export const Stake = ({ pool, account, chainIdPage, visible, refetchPoolList, onConfirm, onClose }: StakeProps) => {
  const config = chainConfig(chainIdPage)
  const [selectedItems, setSelectedItems] = useState<SelectedNftStake[]>([])
  const [isConfirmModalShowing, setIsConfirmModalShowing] = useState(false)
  const [isStaking, setIsStaking] = useState(false)
  const handleConfirm = (items: SelectedNftStake[]) => {
    setIsStaking(false)
    setSelectedItems(items)
    setIsConfirmModalShowing(true)
  }

  useEffect(() => {
    setIsStaking(visible)
  }, [visible])
  return (
    <>
      <StakeModal
        visible={visible && isStaking}
        onClose={onClose}
        pool={pool}
        chainIdPage={chainIdPage}
        onConfirm={handleConfirm}
        account={account}
        stakeTokenImage={pool.offchain?.stakeTokenImage}
      />
      <ModalConfirm visible={isConfirmModalShowing} type='success' title='Stake confirmed!' onOk={onConfirm} onCancel={onConfirm}>
        <Row gutter={[0, 8]}>
          {selectedItems.map(item => (
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
    </>
  )
}

const { CheckIcon } = {
  CheckIcon: styled(CheckOutlined)`
    color: var(--primary-color);
  `
}
