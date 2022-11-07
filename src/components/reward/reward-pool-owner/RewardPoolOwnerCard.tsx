import { RewardPool } from '@appTypes/pool/RewardPool'
import { Card } from '@components/shared/card/Card'
import { Button } from '@components/shared/design-system'
import { chainConfig } from '@config/chain'
import { useTvlErc721 } from '@hook/reward-pool-erc721/useTvlErc721'
import { connectWallet, switchNetwork } from '@nftfyorg/wallet'
import { toHumanFormat } from '@services/UtilService'
import { Typography } from 'antd'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { TokenTypeEnum } from './pool-program/ChooseTypeModal'
import { PoolProgramModal } from './pool-program/ProgramModal'

interface RewardPoolOwnerCardProps {
  chainId: number
  walletChainId: number | null
  accountAddress?: string
  pool: RewardPool
  refetchPools: () => void
}

const { Text, Title } = Typography

export function RewardPoolOwnerCard({ chainId, walletChainId, accountAddress, pool, refetchPools }: RewardPoolOwnerCardProps) {
  const config = chainConfig(chainId)
  const [isEditing, setIsEditing] = useState(false)
  const isPoolWithRewards = !!pool?.rewards?.length && !!pool.rewards[0]?.token?.id

  const [tvl, setTvl] = useState('0')
  const { getTvlErc721, loading: isLoadingTvlErc721, data: dataTvlErc721, error: errorTvl721 } = useTvlErc721()

  useEffect(() => {
    getTvlErc721({
      variables: {
        chainId,
        poolAddress: pool.address
      }
    })
  }, [chainId, getTvlErc721, pool.address, pool.token.id])

  useEffect(() => {
    if (!isLoadingTvlErc721 && dataTvlErc721 && !errorTvl721) {
      setTvl(dataTvlErc721.stakedTvlErc721)
    }
  }, [isLoadingTvlErc721, dataTvlErc721, errorTvl721])

  const finishModal = () => {
    setIsEditing(false)
    refetchPools()
  }

  return (
    <Card
      pool={pool}
      accountAddress={accountAddress}
      chainId={chainId}
      walletChainId={walletChainId}
      scanAddress={config.scanAddress}
      loading={false}
      stakeToken={{
        label: pool.token.native ? config.nativeToken.symbol : pool.token?.symbol || pool.token?.name,
        address: pool.token.id,
        image: pool.offchain?.stakeTokenImage
      }}
      rewardToken={
        isPoolWithRewards
          ? {
              label: pool.rewards[0].token?.symbol || pool?.rewards[0]?.token?.name,
              address: pool.rewards[0].token.id,
              image: pool.offchain?.earnTokenImage
            }
          : undefined
      }
    >
      <Tvl>
        <div>
          <Text type='secondary'>TVL</Text>
          <div>
            <Title level={5}>{toHumanFormat(+tvl)}</Title>
            <Text type='secondary'>USD</Text>
          </div>
        </div>
        <div>
          <Text type='secondary'>Participants</Text>
          <Title level={5}>{pool.userCount || 0}</Title>
        </div>
      </Tvl>
      <Action>
        <Button
          shape='default'
          type='primary'
          ghost
          block
          chainId={chainId}
          currentChainId={walletChainId}
          accountAddress={accountAddress}
          onConnectWallet={connectWallet}
          onChangeNetwork={switchNetwork}
          skipStateValidation={false}
          onClick={() => setIsEditing(true)}
        >
          Edit Program
        </Button>
      </Action>
      {isEditing && <PoolProgramModal tokenType={TokenTypeEnum.ERC721} onCancel={finishModal} pool={pool} chainId={chainId} />}
    </Card>
  )
}

const { Tvl, Action } = {
  Tvl: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    > div:nth-child(1) {
      display: flex;
      flex-direction: column;

      > div {
        display: flex;
        flex-direction: row;
        gap: 4px;
        align-items: baseline;
      }
    }

    > div:nth-child(2) {
      text-align: end;
      display: flex;
      flex-direction: column;
    }
  `,
  Action: styled.div`
    margin-top: 4px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  `
}
