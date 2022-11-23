import { HarvestStakeToken } from '@appTypes/pool/Harvest'
import { RewardPool } from '@appTypes/pool/RewardPool'
import { SelectedNftStake } from '@appTypes/stake/SelectedNftStake'
import { ProgramStakeMyStake } from '@components/shared/program/stake/MyStake'

import { useMyRewards } from '@hook/shared/useMyRewards'

import { toHumanFormat } from '@services/UtilService'
import { Col, Divider, Row } from 'antd'
import { useEffect, useState } from 'react'
import { useNetwork } from 'wagmi'
import { useErc721IsApprovedForAll } from '../../../hook/reward/erc721/useErc721IsApprovedForAll'
import { useErc721SetApprovalForAll } from '../../../hook/reward/erc721/useErc721SetApprovalForAll'
import { useRewardPoolErc721Deposit } from '../../../hook/reward/pool-erc721/useRewardPoolErc721Deposit'
import { Harvest } from './harvest/Harvest'
import { StakeErc721 } from './stake/StakeErc721'
import { StakeERC721Action } from './stake/StakeErc721Action'
import { SucessfullStakeErc721 } from './stake/SucessfulStakeErc721'
import { Unstake } from './unstake/Unstake'

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
  const { chain } = useNetwork()
  const walletChainId = chain?.id ?? null

  const [selectedItems, setSelectedItems] = useState<SelectedNftStake[]>([])
  const [amountMyStake, setAmountMyStake] = useState<string>('0')
  const [stakedToken, setStakedToken] = useState<HarvestStakeToken | null>(null)
  const [isUnstaking, setIsUnstaking] = useState(false)
  const [isConfirmModalShowing, setIsConfirmModalShowing] = useState(false)

  const { isLoading: isApprovingUnlock, setApprovalForAll, status: unlockStatus } = useErc721SetApprovalForAll(accountAddress, pool.address)

  const {
    refetch: refetchUnlock,
    isApprovedForAll,
    isLoading: isCheckingUnlock
  } = useErc721IsApprovedForAll(pool.token.id, accountAddress, pool.address, chainId)

  const {
    isLoading: isStaking,
    status: stakeStatus,
    deposit: depositStake
  } = useRewardPoolErc721Deposit(
    pool.address,
    selectedItems.map(item => item.tokenId)
  )

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

  const handleConfirmStake = () => {
    setIsConfirmModalShowing(true)
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
          stakeStatus={stakeStatus === 'success'}
          stakeTokenImage={stakeTokenImage}
          unlockStatus={unlockStatus}
          isApprovingUnlock={isApprovingUnlock}
          isApprovedForAll={isApprovedForAll}
          onConfirm={handleConfirmStake}
          refetchUnlock={refetchUnlock}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          hideInfo
        >
          <Col span={24}>
            <StakeERC721Action
              account={accountAddress}
              chainId={chainId}
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
          {!isExpired && stakedToken && walletChainId && pool.rewards[0] && pool?.hasStake && (
            <Col span={12}>
              <Harvest
                rewardToken={pool.rewards[0]}
                stakeToken={stakedToken}
                poolAddress={pool.address}
                reward={myRewards.reward}
                refetch={myRewards.refetch}
                chainId={chainId}
                tokenImageReward={pool.offchain?.earnTokenImage || ''}
              />
            </Col>
          )}
          {accountAddress && (
            <Unstake
              account={accountAddress}
              pool={pool}
              visible={isUnstaking}
              chainId={chainId}
              myRewards={myRewards.reward ? toHumanFormat(+myRewards.reward) : '0'}
              onConfirm={confirmedUnstake}
            />
          )}
        </Row>
      </Col>
      <SucessfullStakeErc721
        chainId={chainId}
        pool={pool}
        visible={isConfirmModalShowing}
        items={selectedItems}
        onConfirm={onGetPool}
        onCancel={onGetPool}
      />
    </Row>
  )
}
