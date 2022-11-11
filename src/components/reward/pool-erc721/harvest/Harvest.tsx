import { HarvestStakeToken } from '@appTypes/pool/Harvest'
import { Reward } from '@appTypes/pool/RewardPool'
import { CardToken } from '@components/shared/card-token/CardToken'
import { ModalConfirm } from '@components/shared/design-system'
import { ProgramStakeMyRewards } from '@components/shared/program/stake/MyRewards'

import { useEffect, useState } from 'react'
import { useRewardPoolErc721Harvest } from '../../../../hook/reward/pool-erc721/useRewardPoolErc721Harvest'

interface HarvestProps {
  poolAddress: string
  stakeToken: HarvestStakeToken
  rewardToken: Reward
  reward?: string
  chainId: number
  tokenImageReward: string
  refetch: () => void
}

export function Harvest({ poolAddress, stakeToken, rewardToken, reward, refetch, chainId, tokenImageReward }: HarvestProps) {
  const [isConfirmed, setIsConfirmed] = useState(false)
  const { loading, getHarvest, status } = useRewardPoolErc721Harvest(poolAddress, rewardToken.token.id)

  const handleConfirmed = () => {
    refetch()
    setIsConfirmed(false)
  }

  useEffect(() => {
    if (!loading && status) {
      setIsConfirmed(true)
    }
  }, [status, reward, stakeToken, rewardToken, loading])

  return (
    <>
      <ProgramStakeMyRewards
        symbol={rewardToken.token.symbol || rewardToken.token.name}
        amount={reward}
        onHarvest={getHarvest}
        loading={loading}
      />
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
