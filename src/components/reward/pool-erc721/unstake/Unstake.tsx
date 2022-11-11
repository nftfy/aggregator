import { ModalConfirm } from '@components/shared/design-system'
import { useState } from 'react'
import { RewardPool } from '../../../../types/pool/RewardPool'
import { SuccessfulUnstakeNft } from './SuccessfulUnstakeNft'
import { SelectedNft, UnstakeErc721Modal } from './UnstakeErc721Modal'

interface UnstakeProps {
  pool: RewardPool
  account: string
  chainId: number
  myRewards: string
  onConfirm: (pool: RewardPool) => void
}

export function Unstake({ pool, chainId, onConfirm, myRewards, account }: UnstakeProps) {
  const [isUnstaking, setIsUnstaking] = useState(true)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [unstakedNfts, setUnstakedNfts] = useState<SelectedNft[]>([])
  const [rewardsEarned, setRewardsEarned] = useState<string>('0')

  const handleUnstakeErc721 = async (selectedItems: SelectedNft[], isConfirmed: boolean, rewardsEarned: string) => {
    setUnstakedNfts(selectedItems)
    setIsConfirmed(isConfirmed)
    setRewardsEarned(rewardsEarned)
  }

  const handleConfirm = async () => {
    setIsUnstaking(false)
    setIsConfirmed(false)
    onConfirm(pool)
  }

  const handleCancel = async () => {
    setIsUnstaking(false)
    setIsConfirmed(false)
    onConfirm(pool)
  }
  return (
    <>
      {isUnstaking && (
        <UnstakeErc721Modal
          account={account}
          pool={pool}
          chainId={chainId}
          myRewards={myRewards}
          visible={isUnstaking && !isConfirmed}
          onClose={handleCancel}
          onConfirm={handleUnstakeErc721}
        />
      )}
      {isConfirmed && (
        <ModalConfirm onOk={handleConfirm} onCancel={handleCancel} title='Unstake confirmed!' type='success' visible={isConfirmed}>
          <SuccessfulUnstakeNft unstakedItems={unstakedNfts} pool={pool} rewardsEarned={rewardsEarned} chainId={chainId} />
        </ModalConfirm>
      )}
    </>
  )
}
