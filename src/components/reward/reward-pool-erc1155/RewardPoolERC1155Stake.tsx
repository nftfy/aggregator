import { useReactiveVar } from '@apollo/client'
import { HarvestStakeToken } from '@appTypes/pool/Harvest'
import { RewardPool } from '@appTypes/pool/RewardPool'
import { SelectedNftStake } from '@appTypes/stake/SelectedNftStake'
import { Unstake } from '@components/reward-pool-erc1155/unstake/Unstake'
import { ProgramStakeMyStake } from '@components/shared/program/stake/MyStake'
import { useStakeErc1155 } from '@hook/contracts/reward-pool-erc1155/useRewardPoolErc1155Deposit'
import { useErc1155ApproveForAll } from '@hook/erc1155/useErc1155ApproveForAll'
import { useMyRewards } from '@hook/shared/useMyRewards'
import { signerProviderVar, walletChainIdVar } from '@nftfyorg/wallet'
import { toHumanFormat } from '@services/UtilService'
import { Col, Divider, Row } from 'antd'
import { useEffect, useState } from 'react'
import { Harvest } from './harvest/Harvest'
import { StakeERC1155 } from './stake/Stake1155'
import { StakeERC1155Action } from './stake/Stake1155Action'

interface RewardPoolERC1155StakeProps {
  pool: RewardPool
  chainId: number
  stakeTokenImage?: string
  accountAddress: string
  isExpired: boolean
  onGetPool: () => Promise<void>
}

export function RewardPoolERC1155Stake({
  pool,
  accountAddress,
  chainId,
  stakeTokenImage,
  isExpired,
  onGetPool
}: RewardPoolERC1155StakeProps) {
  const signerProvider = useReactiveVar(signerProviderVar)
  const walletChainId = useReactiveVar(walletChainIdVar)

  const [selectedItems, setSelectedItems] = useState<SelectedNftStake[]>([])
  const [amountMyStake, setAmountMyStake] = useState<string>('0')
  const [stakedToken, setStakedToken] = useState<HarvestStakeToken | null>(null)
  const [isUnstaking, setIsUnstaking] = useState(false)

  const {
    isLoading: isLoadingUnlock,
    isApprovedForAll,
    setApprovalForAll
  } = useErc1155ApproveForAll(chainId, pool.token.id, pool.address, accountAddress)

  const { isLoading: isLoadingStakeErc1155, deposit, status } = useStakeErc1155()

  const onSelectItem = (tokenId: string, amount: string, image: string) => {
    const selectedItemsToUpdate = selectedItems.filter(item => item.tokenId !== tokenId)

    if (!amount || !+amount) {
      setSelectedItems(selectedItemsToUpdate)
      return
    }

    setSelectedItems(selectedItemsToUpdate.concat({ tokenId, amount, image }))
  }

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

  return (
    <Row>
      <Col span={24}>
        <StakeERC1155
          pool={pool}
          stakePoolImage={stakeTokenImage}
          account={accountAddress}
          chainIdPage={chainId}
          handleStakeConfirmed={onGetPool}
          status={status}
          isApprovedForAll={isApprovedForAll}
          onSelectItem={onSelectItem}
          selectedItems={selectedItems}
          stakedAmount={amountMyStake}
          hideInfo
        >
          <Col span={24}>
            <StakeERC1155Action
              deposit={deposit}
              pool={pool}
              account={accountAddress}
              chainId={chainId}
              signerProvider={signerProvider}
              setApprovalForAll={setApprovalForAll}
              isApprovedForAll={isApprovedForAll}
              walletChainId={walletChainId}
              selectedItems={selectedItems}
              isLoadingUnlock={isLoadingUnlock}
              isLoadingStakeErc1155={isLoadingStakeErc1155}
            />
          </Col>
        </StakeERC1155>
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
                rewardToken={pool?.rewards[0]}
                poolAddress={pool.address}
                reward={myRewards.reward}
                refetch={myRewards.refetch}
                signerProvider={signerProvider}
                chainId={chainId}
                tokenImageReward={pool.offchain?.earnTokenImage}
              />
            </Col>
          )}
          {isUnstaking && accountAddress && signerProvider && (
            <Unstake
              pool={pool}
              chainId={chainId}
              account={accountAddress}
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
