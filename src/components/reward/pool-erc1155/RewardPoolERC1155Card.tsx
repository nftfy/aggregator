import { HarvestStakeToken } from '@appTypes/pool/Harvest'
import { RewardPool } from '@appTypes/pool/RewardPool'
import { Card } from '@components/shared/card/Card'
import { ProgramStakeMyStake } from '@components/shared/program/stake/MyStake'
import { chainConfig } from '@config/chain'
import { Web3Provider } from '@ethersproject/providers'
import { useMyRewards } from '@hook/shared/useMyRewards'
import { toHumanFormat } from '@services/UtilService'
import { Col, Divider, Row } from 'antd'
import { useEffect, useState } from 'react'
import { Harvest } from './harvest/Harvest'
import { StakeModal } from './stake/StakeModal'
import { Unstake } from './unstake/Unstake'

interface RewardPoolERC1155CardProps {
  accountAddress?: string
  signerProvider: Web3Provider | null
  pool: RewardPool
  chainId: number
  walletChainId: number | null
  loading: boolean
  refetchStakingPoolList: () => void
}

export function RewardPoolERC1155Card({
  pool,
  chainId,
  accountAddress,
  refetchStakingPoolList,
  signerProvider,
  walletChainId,
  loading
}: RewardPoolERC1155CardProps) {
  const config = chainConfig(chainId)

  const [isUnstaking, setIsUnstaking] = useState(false)
  const [isStaking, setIsStaking] = useState(false)
  const [amountMyStake, setAmountMyStake] = useState<string>('')
  const [stakedToken, setStakedToken] = useState<HarvestStakeToken | null>(null)
  const [stakeModalTitle, setStakeModalTitle] = useState('Stake')

  const myRewards = useMyRewards(
    chainId,
    pool.hasStake,
    pool.address,
    pool?.rewards[0]?.token?.decimals || null,
    pool?.rewards[0]?.token?.id || '',
    accountAddress
  )

  const confirmedUnstake = () => {
    setIsUnstaking(false)
    refetchStakingPoolList()
  }

  const handleConfirmStake = () => {
    setIsStaking(false)
    refetchStakingPoolList()
  }

  useEffect(() => {
    if (!accountAddress) {
      return
    }

    const amountERC721Or1155 = pool.items?.find(item => item.tokenId === null)?.amount

    if (amountERC721Or1155) {
      setAmountMyStake(amountERC721Or1155)
    }
  }, [pool, accountAddress])

  useEffect(() => {
    const harvestStakeToken: HarvestStakeToken = {
      id: pool.token.id,
      chainId,
      image: pool.offchain?.stakeTokenImage,
      name: pool.token.name || '',
      symbol: pool.token.symbol || ''
    }
    setStakedToken(harvestStakeToken)
  }, [chainId, pool.address, pool.offchain?.stakeTokenImage, pool.token.id, pool.token.name, pool.token.symbol])

  useEffect(() => {
    setStakeModalTitle(pool.hasStake ? 'Add more stake' : 'Stake')
  }, [pool.hasStake])

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
        address: pool?.rewards[0]?.token?.id || pool.token.id
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
            {!isExpired && stakedToken && walletChainId && pool.rewards[0] && (
              <Col span={24}>
                <Harvest
                  rewardToken={pool?.rewards[0]}
                  poolAddress={pool.address}
                  reward={myRewards.reward}
                  refetch={myRewards.refetch}
                  chainId={chainId}
                  tokenImageReward={pool.offchain?.earnTokenImage}
                />
              </Col>
            )}
          </Row>
          {isUnstaking && accountAddress && (
            <Unstake
              pool={pool}
              chainId={chainId}
              account={accountAddress}
              myRewards={myRewards.reward ? toHumanFormat(+myRewards.reward) : '0'}
              onConfirm={confirmedUnstake}
            />
          )}
          {pool.token?.id && isStaking && accountAddress && (
            <StakeModal
              title={stakeModalTitle}
              visible={isStaking}
              onClose={() => setIsStaking(false)}
              pool={pool}
              chainIdPage={chainId}
              onConfirm={handleConfirmStake}
              account={accountAddress}
              stakePoolImage={pool.offchain?.stakeTokenImage}
              stakedAmount={amountMyStake}
            />
          )}
        </>
      )}
    </Card>
  )
}
