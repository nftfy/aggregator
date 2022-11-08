import { RewardPool } from '@appTypes/pool/RewardPool'
import { Button } from '@components/shared/design-system/Button'
import { ProgramDetailsEarn } from '@components/shared/program/details/Earn'
import { ProgramDetailsParticipants } from '@components/shared/program/details/Participants'
import { ProgramDetailsSponsorBy } from '@components/shared/program/details/SponsorBy'
import { ProgramDetailsStake } from '@components/shared/program/details/Stake'
import { ProgramDetailsTimeLeft } from '@components/shared/program/details/TimeLeft'
import { useRemainingTime } from '@hook/shared/useRemainingTime'

import { Card as AntCard, Col, Row } from 'antd'
import debounce from 'lodash.debounce'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode, useState } from 'react'
import styled from 'styled-components'
import { useAccount } from 'wagmi'
import { CardCover } from './CardCover'

export type Token = {
  id?: string
  label?: string
  image?: string
  address: string
  loading?: boolean
}

export type RenderChildrenProps = { isExpired: boolean }

export interface CardProps {
  chainId: number
  scanAddress: string
  loading: boolean
  pool?: RewardPool
  stakeToken: Token
  rewardToken?: Partial<Token>
  children: ((props: RenderChildrenProps) => ReactNode) | ReactNode | ReactNode[]
  walletChainId: number | null
  accountAddress?: string
}

export function Card({ loading, pool, stakeToken, rewardToken, scanAddress, children, chainId, walletChainId, accountAddress }: CardProps) {
  const router = useRouter()
  const account = useAccount()
  const remainingTime = useRemainingTime({ ...pool?.rewards[0]?.expirationInfo })
  const [isCardHover, setIsCardHover] = useState(false)

  const handleOnMouseOver = debounce(() => {
    if (account?.isDisconnected) {
      return
    }

    setIsCardHover(true)
  })

  const handleOnMouseOut = debounce(() => {
    setIsCardHover(false)
  })

  return (
    <Container
      isCardHover={isCardHover}
      onMouseOver={handleOnMouseOver}
      onMouseOut={handleOnMouseOut}
      cover={<CardCover height={isCardHover ? '0' : '140px'} alt={pool?.address} src={pool?.offchain?.coverImage} />}
      staked={pool?.hasStake}
      loading={loading}
    >
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <ProgramDetailsSponsorBy title='Sponsored by:' sponsor={pool?.offchain?.sponsor} />
        </Col>
        <Col span={24}>
          <Row justify='space-between' gutter={[0, 16]}>
            <ProgramDetailsStake
              stake={{
                url: `${scanAddress}/address/${stakeToken.address}`,
                label: stakeToken.label,
                address: stakeToken.address,
                image: stakeToken.image
              }}
            />
            <ProgramDetailsEarn
              earn={{
                id: rewardToken?.id,
                url: rewardToken?.address && `${scanAddress}/address/${rewardToken.address}`,
                label: rewardToken?.label,
                address: rewardToken?.address,
                image: rewardToken?.image
              }}
            />
          </Row>
        </Col>
        <Col span={24}>
          <Link href={[router.asPath, pool?.address].join('/')} passHref>
            <Button
              type='primary'
              block
              chainId={chainId}
              currentChainId={walletChainId}
              accountAddress={accountAddress}
              onConnectWallet={() => console.log('coonect wallet')}
              onChangeNetwork={() => console.log('network')}
              skipStateValidation={false}
            >
              Details
            </Button>
          </Link>
        </Col>
        <Col span={24}>
          <Row justify='space-between' gutter={[0, 16]}>
            <ProgramDetailsTimeLeft progress={pool?.rewards[0]?.progress} label={remainingTime.label} isExpired={remainingTime.isExpired} />
            <ProgramDetailsParticipants count={pool?.userCount} />
          </Row>
        </Col>
        {account?.isConnected && (
          <Col span={24}>
            {typeof children === 'function'
              ? children({
                  isExpired: remainingTime.isExpired
                })
              : children}
          </Col>
        )}
      </Row>
    </Container>
  )
}

const { Container } = {
  Container: styled(AntCard)<{ staked?: boolean; isCardHover: boolean }>`
    overflow: hidden;
    height: 368px;

    ${({ isCardHover }) =>
      isCardHover &&
      `button:disabled {
        pointer-events: none;
      }`}
  `
}
