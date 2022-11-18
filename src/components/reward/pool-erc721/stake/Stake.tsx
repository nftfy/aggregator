import { CheckOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRewardPoolErc721Deposit } from '../../../../hook/reward/pool-erc721/useRewardPoolErc721Deposit'
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
  const [selectedItems, setSelectedItems] = useState<SelectedNftStake[]>([])
  const [isConfirmModalShowing, setIsConfirmModalShowing] = useState(false)
  const [isStaking, setIsStaking] = useState(false)

  const { isLoading, deposit, status } = useRewardPoolErc721Deposit(
    pool.address,
    selectedItems.map(item => item.tokenId)
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
    if (status === 'pending') {
      setIsStaking(false)
    } else if (status === 'success') {
      setIsStaking(false)
      setIsConfirmModalShowing(true)
    }
  }, [status])

  return (
    <>
      <StakeModal
        visible={visible && isStaking}
        onClose={onClose}
        pool={pool}
        isLoading={isLoading}
        chainIdPage={chainIdPage}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        onConfirm={handleConfirm}
        account={account}
        depositStake={deposit}
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
