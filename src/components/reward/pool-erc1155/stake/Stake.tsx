import { Col, Row } from 'antd'
import { useEffect, useState } from 'react'
import { useStakeErc1155 } from '../../../../hook/reward/pool-erc1155/useRewardPoolErc1155Deposit'
import { toHumanFormat } from '../../../../services/UtilService'
import { RewardPool } from '../../../../types/pool/RewardPool'
import { SelectedNftStake } from '../../../../types/stake/SelectedNftStake'
import CardToken from '../../../shared/card-token/CardToken'
import { ModalConfirm } from '../../../shared/design-system'
import { StakeModal } from './StakeModal'

interface StakeProps {
  title: string
  pool: RewardPool
  chainId: number
  visible: boolean
  accountAddress: string
  onConfirm: () => void
  onClose?: () => void
  stakedAmount: string
}

export const Stake = ({ visible, onConfirm, onClose, pool, chainId, accountAddress, title, stakedAmount }: StakeProps) => {
  const [selectedItems, setSelectedItems] = useState<SelectedNftStake[]>([])
  const [isConfirmModalShowing, setIsConfirmModalShowing] = useState(false)
  const [isStaking, setIsStaking] = useState(false)

  const { deposit, status, isLoading } = useStakeErc1155(
    pool.address,
    selectedItems.map(item => item.tokenId),
    selectedItems.map(item => item.amount)
  )

  const handleConfirm = (items: SelectedNftStake[]) => {
    setIsStaking(false)
    setSelectedItems(items)
    setIsConfirmModalShowing(true)
  }

  useEffect(() => {
    setIsStaking(visible)
  }, [visible])

  useEffect(() => {
    if (status === 'success') {
      setIsStaking(false)
      setIsConfirmModalShowing(true)
    } else if (status === 'pending') {
      setIsStaking(false)
    }
  }, [status, isLoading])

  return (
    <>
      <StakeModal
        title={title}
        visible={visible && isStaking}
        isLoading={isLoading}
        onClose={onClose}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        pool={pool}
        deposit={deposit}
        chainIdPage={chainId}
        onConfirm={handleConfirm}
        account={accountAddress}
        stakePoolImage={pool.offchain?.stakeTokenImage}
        stakedAmount={stakedAmount}
      />

      <ModalConfirm visible={isConfirmModalShowing} type='success' title='Stake confirmed!' onOk={onConfirm} onCancel={onConfirm}>
        <Row gutter={[0, 8]}>
          {selectedItems.map(item => (
            <Col span={24} key={`${item.amount}#${item.tokenId}`}>
              <CardToken
                gutter={0}
                title='My Stake'
                chainId={chainId}
                image={item.image}
                native={pool.token.native}
                token={{
                  ...pool.token,
                  address: pool.token.id,
                  id: item.tokenId
                }}
                showBalanceSymbol={false}
                amount={item.amount ? toHumanFormat(+item.amount) : '0'}
              />
            </Col>
          ))}
        </Row>
      </ModalConfirm>
    </>
  )
}
