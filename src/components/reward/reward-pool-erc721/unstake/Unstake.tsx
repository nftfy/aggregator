import { ModalConfirm } from '@components/shared/design-system'
import { Web3Provider } from '@ethersproject/providers'
import { useEffect, useState } from 'react'
import { useRewardPoolErc721Withdraw } from '../../../../hook/contracts/reward-pool-erc721/useRewardPoolErc721Withdraw'
import { RewardPool } from '../../../../types/pool/RewardPool'
import { SuccessfulUnstakeNft } from './SuccessfulUnstakeNft'
import { SelectedNft, UnstakeErc721Modal } from './UnstakeErc721Modal'

interface UnstakeProps {
  pool: RewardPool
  account: string
  chainId: number
  signerProvider: Web3Provider
  myRewards: string
  onConfirm: (pool: RewardPool) => void
}

export function Unstake({ pool, chainId, onConfirm, myRewards, signerProvider, account }: UnstakeProps) {
  const [isUnstaking, setIsUnstaking] = useState(true)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [unstakedNfts, setUnstakedNfts] = useState<SelectedNft[]>([])
  const [rewardsEarned, setRewardsEarned] = useState<string>('0')

  const { withdraw, status: withdrawStatus, isLoading: isWithdrawing, dismiss: dismissWithdraw } = useRewardPoolErc721Withdraw()

  const handleUnstakeErc721 = async (selectedItems: SelectedNft[]) => {
    const tokenIdList = selectedItems.map(item => item.tokenId)
    setRewardsEarned(myRewards)

    withdraw(pool.address, tokenIdList, signerProvider, chainId)
    setUnstakedNfts(selectedItems)
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
        <UnstakeErc721Modal
          account={account}
          pool={pool}
          chainId={chainId}
          myRewards={myRewards}
          visible={isUnstaking}
          onClose={handleCancel}
          isLoading={isWithdrawing}
          onConfirm={(selectedItems: SelectedNft[]) => handleUnstakeErc721(selectedItems)}
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
