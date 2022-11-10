import CardLoader from '@components/shared/card/CardLoader'
import { Col, Divider, Row, Typography } from 'antd'
import iconPath from 'public/assets/alert-circle.svg'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRewardPoolErc721Withdraw } from '../../../../hook/contracts/reward-pool-erc721/useRewardPoolErc721Withdraw'
import { useErc721TokenIdListItems } from '../../../../hook/erc721/useErc721TokenIdListItems'
import { RewardPool, StakedItem } from '../../../../types/pool/RewardPool'
import CardToken from '../../../shared/card-token/CardToken'
import { Button, Modal } from '../../../shared/design-system'
import { ListItemNft } from '../../../shared/ListItemNft'

interface UnstakeNftModalProps {
  pool: RewardPool
  account: string
  chainId: number
  myRewards: string
  visible?: boolean
  onClose?: () => void
  onConfirm: (selectedItems: SelectedNft[], isConfirmed: boolean, rewardsEarned: string) => void
}

export interface SelectedNft {
  tokenId: string
  amount: string
}

const { Text } = Typography

export function UnstakeErc721Modal({ pool, myRewards, visible, onClose, onConfirm, chainId, account }: UnstakeNftModalProps) {
  const [selectedItems, setSelectedItems] = useState<SelectedNft[]>([])
  const [isDisabled, setIsDisabled] = useState(false)
  const [stakedTokenIdList, setStakedTokenIdList] = useState<StakedItem[]>([])
  const [hasReachedMaxSelection, setHasReachedMaxSelection] = useState(false)

  const {
    execute: obtainStakedNfts,
    erc721TargetByOwner: stakedNfts,
    loading: isLoadingStakedNfts
  } = useErc721TokenIdListItems(
    chainId,
    pool.token.id,
    stakedTokenIdList.map(item => `${item.tokenId || ''}`)
  )

  const handleNftSelection = useCallback(
    (tokenId: string, amount: string) => {
      if (amount === '0') {
        setSelectedItems(selectedItems.filter(item => item.tokenId !== tokenId))
        return
      }

      setSelectedItems(selectedItems.filter(item => item.tokenId !== tokenId).concat({ tokenId, amount }))
    },
    [selectedItems]
  )

  const {
    withdraw,
    status: withdrawStatus,
    isLoading: isWithdrawing
  } = useRewardPoolErc721Withdraw(
    pool.address,
    selectedItems.map(item => item.tokenId)
  )

  useEffect(() => {
    if (!pool.hasStake) {
      return
    }
    const myItems = pool.items.filter(item => item.account.id.toLocaleLowerCase() === account.toLocaleLowerCase() && item.tokenId)

    setStakedTokenIdList(myItems)
  }, [account, pool])

  useEffect(() => {
    if (stakedTokenIdList.length === 0) {
      return
    }

    obtainStakedNfts()
  }, [obtainStakedNfts, stakedTokenIdList.length])

  useEffect(() => {
    setIsDisabled(selectedItems.length === 0)
  }, [selectedItems])

  useEffect(() => {
    setHasReachedMaxSelection(selectedItems.length >= 5)
  }, [selectedItems])

  useEffect(() => {
    if (withdrawStatus && !isWithdrawing) {
      onConfirm(selectedItems, withdrawStatus, myRewards)
    }
  }, [isWithdrawing, withdrawStatus])

  return (
    <Modal
      title='Unstake'
      onCancel={onClose}
      visible={visible}
      customFooter={
        <Button type='primary' block onClick={withdraw} disabled={isDisabled} loading={isWithdrawing}>
          Confirm
        </Button>
      }
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Text>In the unstake process you will withdraw all your stake balance and collect all the reward generated</Text>
        </Col>
        <Col span={24}>
          <CardToken
            title='Earned'
            token={{ ...pool.rewards[0].token, address: pool.rewards[0].token.id }}
            amount={myRewards}
            chainId={chainId}
            image={pool.offchain?.stakeTokenImage}
          />
        </Col>
      </Row>

      <Divider />
      <WalletContent>
        <InfoContent>
          <AlertWrapper>
            <AlertIcon src={iconPath.src} />
            <Text type='secondary'>You can select only 5 NFTs per transaction.</Text>
          </AlertWrapper>
          <Wrapper>
            <Text>My Stake ({selectedItems.length})</Text>
            <Text>{selectedItems.length}/5</Text>
          </Wrapper>
        </InfoContent>
        {isLoadingStakedNfts && <CardLoader />}
        {stakedTokenIdList.length > 0 && !isLoadingStakedNfts && (
          <ListContent>
            {stakedTokenIdList.map(stakedTokenId => (
              <ListItemNft
                disabled={hasReachedMaxSelection && !selectedItems.find(selectedItem => selectedItem.tokenId === stakedTokenId.tokenId)}
                onChange={(tokenId, amount) => handleNftSelection(tokenId, String(amount))}
                token={pool.token}
                item={{ id: stakedTokenId.id, tokenId: stakedTokenId.tokenId, account: { id: account } }}
                key={`${stakedTokenId.id}#${stakedTokenId?.tokenId || ''}`}
                type={pool.type}
                image={stakedNfts.find(item => item.tokenId === stakedTokenId.tokenId)?.metadata?.image}
                chainId={chainId}
              />
            ))}
          </ListContent>
        )}
      </WalletContent>
    </Modal>
  )
}

const { WalletContent, ListContent, InfoContent, AlertWrapper, AlertIcon, Wrapper } = {
  AlertIcon: styled.img`
    display: flex;
    width: 22px;
    height: 22px;
  `,

  AlertWrapper: styled.div`
    display: flex;
    gap: 11px;
  `,
  InfoContent: styled.div`
    display: flex;
    flex-direction: column;
    gap: 27px;
  `,

  Wrapper: styled.div`
    display: flex;
    justify-content: space-between;
  `,
  WalletContent: styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  ListContent: styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-height: 350px;
    overflow-y: auto;
  `
}
