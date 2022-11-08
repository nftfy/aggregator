import { Web3Provider } from '@ethersproject/providers'
import { useEffect, useState } from 'react'
import { useRewardPoolWithdrawErc1155 } from '../../../../hook/contracts/reward-pool-erc1155/useRewardPoolErc1155Withdraw'
import { RewardPool } from '../../../../types/pool/RewardPool'
import { ModalConfirm } from '../../../shared/design-system'
import { SuccessfulUnstakeNft } from './SuccessfulUnstakeNft'
import { SelectedNft, UnstakeErc1155Modal } from './UnstakeErc1155Modal'

interface UnstakeProps {
  pool: RewardPool
  chainId: number
  signerProvider: Web3Provider
  myRewards: string
  onConfirm: (pool: RewardPool) => void
  account: string
}

export function Unstake({ pool, chainId, onConfirm, myRewards, signerProvider, account }: UnstakeProps) {
  const [isUnstaking, setIsUnstaking] = useState(true)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [unstakedNfts, setUnstakedNfts] = useState<SelectedNft[]>([])
  const [rewardsEarned, setRewardsEarned] = useState<string>('0')

  const { withdraw, status: withdrawStatus, isLoading: isWithdrawing, dismiss: dismissWithdraw } = useRewardPoolWithdrawErc1155()

  const handleUnstakeErc1155 = async (selectedItems: SelectedNft[]) => {
    const tokenIdList = selectedItems.map(item => item.tokenId)
    const amountPerId = selectedItems.map(item => item.amount)

    setRewardsEarned(myRewards)

    setUnstakedNfts(selectedItems)
    await withdraw(pool.address, tokenIdList, amountPerId, signerProvider, chainId)
  }

  const handleConfirm = async () => {
    setIsFinished(true)
  }

  const handleCancel = async () => {
    setIsFinished(true)
  }

  useEffect(() => {
    if (withdrawStatus === 'success') {
      setIsUnstaking(false)
      setIsConfirmed(true)
    } else if (withdrawStatus === 'reverted') {
      setIsFinished(true)
      setUnstakedNfts([])
    }
  }, [withdrawStatus])

  useEffect(() => {
    if (isFinished) {
      setIsUnstaking(false)
      setIsConfirmed(false)
      setUnstakedNfts([])
      dismissWithdraw()
      onConfirm(pool)
    }
  }, [onConfirm, isFinished, pool, dismissWithdraw])

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
          isLoading={isWithdrawing}
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
