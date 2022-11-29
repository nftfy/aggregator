import { RewardPool } from '@appTypes/pool/RewardPool'
import { ProgramDetailsDailyRewards } from '@components/shared/program/details/DailyRewards'
import { ProgramDetailsEarn } from '@components/shared/program/details/Earn'
import { ProgramDetailsParticipants } from '@components/shared/program/details/Participants'
import { ProgramDetailsStake } from '@components/shared/program/details/Stake'
import { ProgramDetailsTimeLeft } from '@components/shared/program/details/TimeLeft'
import { ProgramDetailsTVL } from '@components/shared/program/details/TVL'
import { chainConfig } from '@config/chain'

import { UseRemainingTime } from '@hook/shared/useRemainingTime'
import { Col, Row, Space, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useTvlErc721 } from '../../../hook/reward/pool-erc721/useTvlErc721'

interface RewardPoolERC721DetailProps {
  remainingTime: UseRemainingTime
  chainId: number
  pool: RewardPool
}

const { Text } = Typography

export function RewardPoolERC721Detail({ chainId, pool, remainingTime }: RewardPoolERC721DetailProps) {
  const config = chainConfig(chainId)

  const [tvl, setTvl] = useState('0')

  const { getTvlErc721, ...poolTVL } = useTvlErc721()

  useEffect(() => {
    getTvlErc721({
      variables: {
        chainId,
        poolAddress: pool.address
      }
    })
  }, [chainId, pool.address, pool.token.id, getTvlErc721])

  useEffect(() => {
    if (!poolTVL.loading && poolTVL.data?.stakedTvlErc721 && !poolTVL.error) {
      setTvl(poolTVL.data?.stakedTvlErc721)
    }
  }, [poolTVL.loading, poolTVL.data?.stakedTvlErc721, poolTVL.error])

  return (
    <Row gutter={[16, 16]} align='middle'>
      <Col xs={24} sm={24} md={24} lg={12}>
        <ProgramDetailsStake
          stake={{
            url: `${config.scanAddress}/address/${pool.token.id}`,
            label: pool.token?.name || pool.token?.symbol,
            address: pool.token.id,
            image: pool.offchain?.stakeTokenImage
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={24} lg={12}>
        <ProgramDetailsEarn
          earn={{
            label: pool?.rewards[0]?.token?.name || pool?.rewards[0]?.token?.symbol,
            image: pool.offchain?.earnTokenImage,
            address: pool?.rewards[0]?.token?.id
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={24} lg={12}>
        <Space direction='vertical' size={0}>
          <Text type='secondary'>Remaining Time:</Text>
          <ProgramDetailsTimeLeft progress={pool?.rewards[0]?.progress} label={remainingTime.label} isExpired={remainingTime.isExpired} />
        </Space>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12}>
        <Space direction='vertical' size={0}>
          <Text type='secondary'>Participants:</Text>
          <ProgramDetailsParticipants count={pool?.userCount} />
        </Space>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12}>
        <ProgramDetailsDailyRewards
          dailyRewards={{
            amount: pool?.rewards[0]?.dailyRewards,
            label: pool?.rewards[0]?.token?.symbol || pool?.rewards[0]?.token?.name
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={24} lg={12}>
        <ProgramDetailsTVL
          tvl={{
            amount: tvl
          }}
        />
      </Col>
    </Row>
  )
}

export default RewardPoolERC721Detail
