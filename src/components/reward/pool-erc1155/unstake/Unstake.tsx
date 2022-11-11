import { useRafEffect } from '@react-hookz/web'
import { useState } from 'react'
import { RewardPool } from '../../../../types/pool/RewardPool'
import { ModalConfirm } from '../../../shared/design-system'
import { SuccessfulUnstakeNft } from './SuccessfulUnstakeNft'
import { SelectedNft, UnstakeErc1155Modal } from './UnstakeErc1155Modal'

interface UnstakeProps {
  pool: RewardPool
  chainId: number
  myRewards: string
  onConfirm: (pool: RewardPool) => void
  account: string
}

export function Unstake({ pool, chainId, onConfirm, myRewards, account }: UnstakeProps) {
  const [isUnstaking, setIsUnstaking] = useState(true)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [unstakedNfts, setUnstakedNfts] = useState<SelectedNft[]>([])
  const [rewardsEarned, setRewardsEarned] = useState<string>('0')

  const handleUnstakeErc1155 = async (selectedItems: SelectedNft[]) => {
    setIsConfirmed(true)
    setRewardsEarned(myRewards)
    setUnstakedNfts(selectedItems)
  }

  const handleConfirm = async () => {
    setIsFinished(true)
  }

  const handleCancel = async () => {
    setIsFinished(true)
  }

  useRafEffect(() => {
    if (isFinished) {
      setIsUnstaking(false)
      setIsConfirmed(false)
      setUnstakedNfts([])

      onConfirm(pool)
    }
  }, [onConfirm, isFinished, pool])

  return (
    <>
      {isUnstaking && (
        <UnstakeErc1155Modal
          account={account}
          pool={pool}
          chainId={chainId}
          myRewards={myRewards}
          visible={isUnstaking}
          onClose={handleCancel}
          onConfirm={(selectedItems: SelectedNft[]) => handleUnstakeErc1155(selectedItems)}
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
