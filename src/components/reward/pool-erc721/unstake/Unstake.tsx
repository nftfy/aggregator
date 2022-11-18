import { ModalConfirm } from '@components/shared/design-system'
import { useEffect, useState } from 'react'
import { useRewardPoolErc721Withdraw } from '../../../../hook/reward/pool-erc721/useRewardPoolErc721Withdraw'
import { RewardPool } from '../../../../types/pool/RewardPool'
import { SuccessfulUnstakeNft } from './SuccessfulUnstakeNft'
import { SelectedNft, UnstakeErc721Modal } from './UnstakeErc721Modal'

interface UnstakeProps {
  pool: RewardPool
  visible: boolean
  account: string
  chainId: number
  myRewards: string
  onConfirm: (pool: RewardPool) => void
}

export function Unstake({ pool, chainId, onConfirm, visible, myRewards, account }: UnstakeProps) {
  const [isUnstaking, setIsUnstaking] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [unstakedNfts, setUnstakedNfts] = useState<SelectedNft[]>([])

  const {
    withdraw,
    status: withdrawStatus,
    isLoading: isWithdrawing
  } = useRewardPoolErc721Withdraw(
    pool.address,
    unstakedNfts.map(item => item.tokenId)
  )

  const handleConfirm = async () => {
    setIsUnstaking(false)
    setIsConfirmed(false)
  }

  const handleCancel = async () => {
    setIsUnstaking(false)
    setIsConfirmed(false)
    onConfirm(pool)
  }

  useEffect(() => {
    if (withdrawStatus === 'success') {
      setIsConfirmed(true)
    }

    if (withdrawStatus === 'pending') {
      setIsUnstaking(false)
    }
    console.log('withdrawStatus', withdrawStatus)
    console.log('isWithdrawing', isWithdrawing)
  }, [isWithdrawing, withdrawStatus])

  useEffect(() => {
    setIsUnstaking(visible)
  }, [visible])
  return (
    <>
      <UnstakeErc721Modal
        account={account}
        pool={pool}
        chainId={chainId}
        myRewards={myRewards}
        visible={isUnstaking}
        onClose={handleCancel}
        setSelectedItems={setUnstakedNfts}
        selectedItems={unstakedNfts}
        onConfirm={withdraw}
        loading={isWithdrawing}
      />
      <ModalConfirm onOk={handleConfirm} onCancel={handleCancel} title='Unstake confirmed!' type='success' visible={isConfirmed}>
        <SuccessfulUnstakeNft unstakedItems={unstakedNfts} pool={pool} rewardsEarned={myRewards} chainId={chainId} />
      </ModalConfirm>
    </>
  )
}
