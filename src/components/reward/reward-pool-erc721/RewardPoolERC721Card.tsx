import { HarvestStakeToken } from '@appTypes/pool/Harvest'
import { RewardPool } from '@appTypes/pool/RewardPool'
import { Card } from '@components/shared/card/Card'
import { ProgramStakeMyStake } from '@components/shared/program/stake/MyStake'
import { Web3Provider } from '@ethersproject/providers'
import { useMyRewards } from '@hook/shared/useMyRewards'
import { toHumanFormat } from '@services/UtilService'
import { Col, Divider, Row } from 'antd'
import { useEffect, useState } from 'react'
import { chainConfig } from '../../../ChainConfig'
import { Harvest } from './harvest/Harvest'
import { StakeModal } from './stake/StakeModal'
import { Unstake } from './unstake/Unstake'

interface RewardPoolERC721CardProps {
  pool: RewardPool
  chainId: number
  loading: boolean
  accountAddress: string
  walletChainId: number | null
  signerProvider: Web3Provider | null
  refetchStakingPoolList: () => void
}

export function RewardPoolERC721Card({
  pool,
  chainId,
  loading,
  accountAddress,
  walletChainId,
  signerProvider,
  refetchStakingPoolList
}: RewardPoolERC721CardProps) {
  const config = chainConfig(chainId)

  const [isStaking, setIsStaking] = useState(false)
  const [isUnstaking, setIsUnstaking] = useState(false)
  const [stakedToken, setStakedToken] = useState<HarvestStakeToken | null>(null)
  const [amountMyStake, setAmountMyStake] = useState<string>('0')

  const myRewards = useMyRewards(
    chainId,
    pool.hasStake,
    pool.address,
    pool?.rewards[0]?.token?.decimals || null,
    pool?.rewards[0]?.token?.id || '',
    accountAddress
  )

  const handleConfirmStake = () => {
    setIsStaking(false)
    refetchStakingPoolList()
  }

  const confirmedUnstake = () => {
    setIsUnstaking(false)
    refetchStakingPoolList()
  }

  useEffect(() => {
    setStakedToken({
      id: pool.token.id,
      chainId,
      name: pool.token?.name || '',
      symbol: pool.token?.symbol || '',
      image: pool.offchain?.stakeTokenImage
    })
  }, [chainId, pool.token.id, pool.token?.name, pool.token?.symbol, pool.offchain?.stakeTokenImage])

  useEffect(() => {
    if (!accountAddress) {
      return
    }

    const amount = pool.items?.find(item => item.tokenId === null)?.amount

    if (amount) {
      setAmountMyStake(amount)
    }
  }, [pool, accountAddress])

  return (
    <Card
      accountAddress={accountAddress}
      chainId={chainId}
      walletChainId={walletChainId}
      scanAddress={config.scanAddress}
      loading={loading}
      pool={pool}
      stakeToken={{
        label: pool.token?.symbol || pool.token?.name,
        image: pool.offchain?.stakeTokenImage,
        address: pool.token.id
      }}
      rewardToken={{
        label: pool?.rewards[0]?.token?.symbol || pool?.rewards[0]?.token?.name,
        image: pool.offchain?.earnTokenImage,
        address: pool?.rewards[0]?.token?.id
      }}
    >
      {({ isExpired }) => (
        <>
          <Row gutter={[0, 8]}>
            {((isExpired && +amountMyStake > 0) || !isExpired) && (
              <>
                <Col span={24}>
                  <Divider orientation='center' plain style={{ margin: 0, padding: 0 }} />
                </Col>
                <Col span={24}>
                  <ProgramStakeMyStake
                    isExpired={isExpired}
                    symbol={pool.token?.symbol}
                    amount={amountMyStake}
                    onAdd={() => setIsStaking(true)}
                    onUnstake={() => setIsUnstaking(true)}
                  />
                </Col>
              </>
            )}
            {!isExpired && signerProvider && stakedToken && walletChainId && pool.rewards[0] && (
              <Col span={24}>
                <Harvest
                  rewardToken={pool.rewards[0]}
                  stakeToken={stakedToken}
                  poolAddress={pool.address}
                  reward={myRewards.reward}
                  refetch={myRewards.refetch}
                  signerProvider={signerProvider}
                  chainId={chainId}
                  tokenImageReward={pool.offchain?.earnTokenImage || ''}
                />
              </Col>
            )}
          </Row>
          {isUnstaking && accountAddress && signerProvider && (
            <Unstake
              account={accountAddress}
              pool={pool}
              chainId={chainId}
              myRewards={myRewards.reward ? toHumanFormat(+myRewards.reward) : '0'}
              onConfirm={confirmedUnstake}
              signerProvider={signerProvider}
            />
          )}
          {pool.token?.id && isStaking && signerProvider && accountAddress && (
            <StakeModal
              visible={isStaking}
              onClose={() => setIsStaking(false)}
              pool={pool}
              chainIdPage={chainId}
              onConfirm={handleConfirmStake}
              account={accountAddress}
              signerProvider={signerProvider}
              stakeTokenImage={pool.offchain?.stakeTokenImage}
            />
          )}
        </>
      )}
    </Card>
  )
}
