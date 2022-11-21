import { useRafEffect } from '@react-hookz/web'
import { useEffect, useState } from 'react'
import { useRewardPoolWithdrawErc1155 } from '../../../../hook/reward/pool-erc1155/useRewardPoolErc1155Withdraw'
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

  const { withdraw, status, isLoading } = useRewardPoolWithdrawErc1155(
    pool.address,
    unstakedNfts.map(item => item.tokenId),
    unstakedNfts.map(item => item.amount)
  )

  const handleConfirm = async () => {
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

  useEffect(() => {
    if (status === 'pending') {
      setIsUnstaking(false)
    } else if (status === 'success') {
      setIsConfirmed(true)
    }
  }, [status, handleConfirm])

  return (
    <>
      {isUnstaking && (
        <UnstakeErc1155Modal
          isLoading={isLoading}
          account={account}
          selectedItems={unstakedNfts}
          setSelectedItems={setUnstakedNfts}
          withdraw={withdraw}
          pool={pool}
          chainId={chainId}
          myRewards={myRewards}
          visible={isUnstaking}
          onClose={handleConfirm}
        />
      )}
      {isConfirmed && (
        <ModalConfirm onOk={handleConfirm} onCancel={handleConfirm} title='Unstake confirmed!' type='success' visible={isConfirmed}>
          <SuccessfulUnstakeNft unstakedItems={unstakedNfts} pool={pool} rewardsEarned={myRewards} chainId={chainId} />
        </ModalConfirm>
      )}
    </>
  )
}
