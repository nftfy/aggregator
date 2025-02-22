import { RewardPool } from '@appTypes/pool/RewardPool'
import { ProgramDetailsDailyRewards } from '@components/shared/program/details/DailyRewards'
import { ProgramDetailsEarn } from '@components/shared/program/details/Earn'
import { ProgramDetailsParticipants } from '@components/shared/program/details/Participants'
import { ProgramDetailsStake } from '@components/shared/program/details/Stake'
import { ProgramDetailsTimeLeft } from '@components/shared/program/details/TimeLeft'
import { ProgramDetailsTVL } from '@components/shared/program/details/TVL'
import { chainConfig } from '@config/chain'

import { UseRemainingTime } from '@hook/shared/useRemainingTime'
import { Col, Row } from 'antd'
import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'
import { useTvlErc1155 } from '../../../hook/reward/pool-erc1155/useTvlErc1155'

interface RewardPoolERC1155DetailProps {
  remainingTime: UseRemainingTime
  chainId: number
  pool: RewardPool
}

export function RewardPoolERC1155Detail({ chainId, pool, remainingTime }: RewardPoolERC1155DetailProps) {
  const config = chainConfig(chainId)

  const [tvl, setTvl] = useState('0')
  const [dailyRewards, setDailyRewards] = useState<string>('0')

  const { getTvlErc1155, ...poolTVL } = useTvlErc1155()

  useEffect(() => {
    setDailyRewards(new BigNumber(pool?.rewards[0]?.rewardPerSec || 0).multipliedBy(60).multipliedBy(60).multipliedBy(24).toString())
  }, [pool])

  useEffect(() => {
    getTvlErc1155({
      variables: {
        chainId,
        poolAddress: pool.address
      }
    })
  }, [chainId, pool.address, pool.token.id, getTvlErc1155])

  useEffect(() => {
    if (!poolTVL.loading && poolTVL.data?.stakedTvlErc1155 && !poolTVL.error) {
      setTvl(poolTVL.data?.stakedTvlErc1155)
    }
  }, [poolTVL.loading, poolTVL.data?.stakedTvlErc1155, poolTVL.error])

  return (
    <Row gutter={[16, 16]} align='middle'>
      <Col span={12}>
        <ProgramDetailsStake
          stake={{
            url: `${config.scanAddress}/address/${pool.token.id}`,
            label: pool.token?.name || pool.token?.symbol,
            address: pool.token.id,
            image: pool.offchain?.stakeTokenImage
          }}
        />
      </Col>
      <Col span={12}>
        <ProgramDetailsEarn
          earn={{
            label: pool?.rewards[0]?.token?.name || pool?.rewards[0]?.token?.symbol,
            image: pool.offchain?.earnTokenImage,
            address: pool?.rewards[0]?.token?.id
          }}
        />
      </Col>
      <Col span={12}>
        <ProgramDetailsTimeLeft progress={pool?.rewards[0]?.progress} label={remainingTime.label} isExpired={remainingTime.isExpired} />
      </Col>
      <Col span={12}>
        <ProgramDetailsParticipants count={pool?.userCount} />
      </Col>
      <Col span={12}>
        <ProgramDetailsDailyRewards
          dailyRewards={{
            amount: dailyRewards,
            label: pool?.rewards[0]?.token?.symbol || pool?.rewards[0]?.token?.name
          }}
        />
      </Col>
      <Col span={12}>
        <ProgramDetailsTVL
          tvl={{
            amount: tvl
          }}
        />
      </Col>
    </Row>
  )
}

export default RewardPoolERC1155Detail
