import { useReactiveVar } from '@apollo/client'
import { HarvestStakeToken } from '@appTypes/pool/Harvest'
import { RewardPool } from '@appTypes/pool/RewardPool'
import { SelectedNftStake } from '@appTypes/stake/SelectedNftStake'
import { Harvest } from '@components/reward-pool-erc721/harvest/Harvest'
import { Unstake } from '@components/reward-pool-erc721/unstake/Unstake'
import { ProgramStakeMyStake } from '@components/shared/program/stake/MyStake'
import { useErc721IsApprovedForAll } from '@hook/contracts/erc721/useErc721IsApprovedForAll'
import { useErc721SetApprovalForAll } from '@hook/contracts/erc721/useErc721SetApprovalForAll'
import { useRewardPoolErc721Deposit } from '@hook/contracts/reward-pool-erc721/useRewardPoolErc721Deposit'
import { useMyRewards } from '@hook/shared/useMyRewards'
import { signerProviderVar, walletChainIdVar } from '@nftfyorg/wallet'
import { toHumanFormat } from '@services/UtilService'
import { Col, Divider, Row } from 'antd'
import { useEffect, useState } from 'react'
import { StakeErc721 } from './stake/StakeErc721'
import { StakeERC721Action } from './stake/StakeErc721Action'

interface RewardPoolERC721StakeProps {
  pool: RewardPool
  chainId: number
  stakeTokenImage?: string
  accountAddress: string
  isExpired: boolean
  onGetPool: () => Promise<void>
}

export function RewardPoolERC721Stake({
  pool,
  accountAddress,
  chainId,
  stakeTokenImage,
  isExpired,
  onGetPool
}: RewardPoolERC721StakeProps) {
  const walletChainId = useReactiveVar(walletChainIdVar)
  const signerProvider = useReactiveVar(signerProviderVar)

  const [selectedItems, setSelectedItems] = useState<SelectedNftStake[]>([])
  const [amountMyStake, setAmountMyStake] = useState<string>('0')
  const [stakedToken, setStakedToken] = useState<HarvestStakeToken | null>(null)
  const [isUnstaking, setIsUnstaking] = useState(false)

  const { isLoading: isApprovingUnlock, setApprovalForAll, status: unlockStatus } = useErc721SetApprovalForAll()

  const {
    refetch: refetchUnlock,
    isApprovedForAll,
    isLoading: isCheckingUnlock
  } = useErc721IsApprovedForAll(pool.token.id, accountAddress, pool.address, chainId)

  const { isLoading: isStaking, status: stakeStatus, deposit: depositStake } = useRewardPoolErc721Deposit()

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
    onGetPool()
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
    <Row>
      <Col span={24}>
        <StakeErc721
          pool={pool}
          chainIdPage={chainId}
          account={accountAddress}
          stakeStatus={stakeStatus}
          stakeTokenImage={stakeTokenImage}
          unlockStatus={unlockStatus}
          isApprovingUnlock={isApprovingUnlock}
          isApprovedForAll={isApprovedForAll}
          onConfirm={onGetPool}
          refetchUnlock={refetchUnlock}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          hideInfo
        >
          <Col span={24}>
            <StakeERC721Action
              pool={pool}
              account={accountAddress}
              chainId={chainId}
              signerProvider={signerProvider}
              isApprovingUnlock={isApprovingUnlock}
              setApprovalForAll={setApprovalForAll}
              isApprovedForAll={isApprovedForAll}
              isCheckingUnlock={isCheckingUnlock}
              walletChainId={walletChainId}
              isStaking={isStaking}
              selectedItems={selectedItems}
              depositStake={depositStake}
            />
          </Col>
        </StakeErc721>
      </Col>
      <Col span={24}>
        <Row gutter={[16, 0]}>
          {((isExpired && +amountMyStake > 0) || (!isExpired && +amountMyStake > 0)) && (
            <>
              <Col span={24}>
                <Divider orientation='center' plain />
              </Col>
              <Col span={12}>
                <ProgramStakeMyStake
                  hideAddButton
                  isExpired={isExpired}
                  symbol={pool.token?.symbol}
                  amount={amountMyStake}
                  onUnstake={() => setIsUnstaking(true)}
                />
              </Col>
            </>
          )}
          {!isExpired && signerProvider && stakedToken && walletChainId && pool.rewards[0] && pool?.hasStake && (
            <Col span={12}>
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
        </Row>
      </Col>
    </Row>
  )
}
