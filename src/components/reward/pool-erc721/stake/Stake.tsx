import { CheckOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { chainConfig } from '../../../../ChainConfig'
import { RewardPool } from '../../../../types/pool/RewardPool'
import { SelectedNftStake } from '../../../../types/stake/SelectedNftStake'
import { StakeModal } from './StakeModal'
import { SucessfullStakeErc721 } from './SucessfulStakeErc721'

interface StakeProps {
  pool: RewardPool
  chainIdPage: number
  account: string
  visible: boolean
  onConfirm: () => void
  onClose?: () => void
}

export const Stake = ({ pool, account, chainIdPage, visible, onConfirm, onClose }: StakeProps) => {
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
      <SucessfullStakeErc721
        chainId={chainIdPage}
        pool={pool}
        visible={isConfirmModalShowing}
        items={selectedItems}
        onConfirm={onConfirm}
        onCancel={onConfirm}
      />
    </>
  )
}

const { CheckIcon } = {
  CheckIcon: styled(CheckOutlined)`
    color: var(--primary-color);
  `
}
