import { Reward } from '@appTypes/pool/RewardPool'
import { CardToken } from '@components/shared/card-token/CardToken'
import { ModalConfirm } from '@components/shared/design-system'
import { ProgramStakeMyRewards } from '@components/shared/program/stake/MyRewards'
import { Web3Provider } from '@ethersproject/providers'
import { useEffect, useState } from 'react'
import { useRewardPoolErc1155Harvest } from '../../../../hook/reward/pool-erc1155/useRewardPoolErc1155Harvest'

interface HarvestProps {
  poolAddress: string
  rewardToken: Reward
  reward?: string
  signerProvider: Web3Provider
  chainId: number
  tokenImageReward?: string
  refetch: () => void
}

export function Harvest({ poolAddress, rewardToken, reward, signerProvider, refetch, chainId, tokenImageReward }: HarvestProps) {
  const [isConfirmed, setIsConfirmed] = useState(false)
  const { loading, getHarvest, status, dismiss } = useRewardPoolErc1155Harvest()

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
  }, [status, reward, rewardToken, loading, dismiss])

  return (
    <>
      <ProgramStakeMyRewards
        symbol={rewardToken.token.symbol || rewardToken.token.name}
        amount={reward}
        onHarvest={handleOnHarvest}
        loading={false}
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
