import { HarvestStakeToken } from '@appTypes/pool/Harvest'
import { Reward } from '@appTypes/pool/RewardPool'
import { CardToken } from '@components/shared/card-token/CardToken'
import { ModalConfirm } from '@components/shared/design-system'
import { ProgramStakeMyRewards } from '@components/shared/program/stake/MyRewards'
import { Web3Provider } from '@ethersproject/providers'
import { useRewardPoolErc721Harvest } from '@hook/contracts/reward-pool-erc721/useRewardPoolErc721Harvest'
import { useEffect, useState } from 'react'

interface HarvestProps {
  poolAddress: string
  stakeToken: HarvestStakeToken
  rewardToken: Reward
  reward?: string
  signerProvider: Web3Provider
  chainId: number
  tokenImageReward: string
  refetch: () => void
}

export function Harvest({
  poolAddress,
  stakeToken,
  rewardToken,
  reward,
  signerProvider,
  refetch,
  chainId,
  tokenImageReward
}: HarvestProps) {
  const [isConfirmed, setIsConfirmed] = useState(false)
  const { loading, getHarvest, status, dismiss } = useRewardPoolErc721Harvest()

  const handleConfirmed = () => {
    refetch()
    setIsConfirmed(false)
  }

  const handleOnHarvest = () => {
    getHarvest(signerProvider, poolAddress, rewardToken.token.id, chainId)
  }

  useEffect(() => {
    if (!loading && status === 'success') {
      setIsConfirmed(true)
      dismiss()
    }
  }, [status, reward, stakeToken, rewardToken, loading, dismiss])

  return (
    <>
      <ProgramStakeMyRewards symbol={rewardToken.token.symbol || rewardToken.token.name} amount={reward} onHarvest={handleOnHarvest} />
      <ModalConfirm type='success' title='Harvest confirmed' visible={isConfirmed} onCancel={handleConfirmed} onOk={handleConfirmed}>
        <CardToken
          title='Earned'
          amount={reward}
          native={rewardToken.token.native}
          token={{ address: rewardToken.token.id, ...rewardToken.token }}
          image={tokenImageReward}
          chainId={chainId}
        />
      </ModalConfirm>
    </>
  )
}
