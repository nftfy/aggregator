import { Col, Divider, Row, Typography } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useErc721TokenIdListItems } from '../../../../hook/reward/erc721/useErc721TokenIdListItems'
import { useRewardPoolWithdrawErc1155 } from '../../../../hook/reward/pool-erc1155/useRewardPoolErc1155Withdraw'
import { RewardPool, StakedItem } from '../../../../types/pool/RewardPool'
import CardToken from '../../../shared/card-token/CardToken'
import CardLoader from '../../../shared/card/CardLoader'
import { Button, Modal } from '../../../shared/design-system'
import { ListItemNft } from '../../../shared/ListItemNft'

interface UnstakeNftModalProps {
  pool: RewardPool
  chainId: number
  myRewards: string
  visible?: boolean
  onClose?: () => void
  onConfirm: (selectedItems: SelectedNft[], stakedItems: StakedItem[]) => void
  account: string
}

export interface SelectedNft {
  tokenId: string
  amount: string
}

const { Text } = Typography

export function UnstakeErc1155Modal({ pool, myRewards, visible, onClose, onConfirm, chainId, account }: UnstakeNftModalProps) {
  const [selectedItems, setSelectedItems] = useState<SelectedNft[]>([])
  const [isDisabled, setIsDisabled] = useState(false)
  const [stakedTokenIdList, setStakedTokenIdList] = useState<StakedItem[]>([])

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

  const walletAccount = '0x7cA2246bC2BB0092285faD93d89325a581323c6a'
  const walletChainId = 5

  const {
    execute: obtainStakedNfts,
    erc721TargetByOwner: stakedNfts,
    loading: isLoadingStakedNfts
  } = useErc721TokenIdListItems(
    chainId,
    pool.token.id,
    stakedTokenIdList.map(item => `${item.tokenId || ''}`)
  )

  const { withdraw, status, isLoading, dismiss } = useRewardPoolWithdrawErc1155(
    pool.address,
    selectedItems.map(item => item.tokenId),
    selectedItems.map(item => item.amount)
  )

  const handleConfirm = useCallback(() => {
    onConfirm(selectedItems, stakedTokenIdList)
  }, [onConfirm, selectedItems, stakedTokenIdList])

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
    if (status === 'success' && !isLoading) {
      handleConfirm()
      dismiss()
    }
  }, [status, handleConfirm])
  return (
    <Modal
      title='Unstake'
      visible={visible}
      onCancel={onClose}
      onOk={onClose}
      customFooter={
        <Row justify='center'>
          <Col span={24}>
            <Button
              block
              type='primary'
              shape='default'
              loading={isLoading}
              onChangeNetwork={() => console.log('change chainId')}
              currentChainId={walletChainId}
              accountAddress={walletAccount}
              onConnectWallet={() => console.log('connect wallet')}
              chainId={chainId}
              disabled={isDisabled}
              onClick={() => {
                withdraw && withdraw()
              }}
            >
              Confirm
            </Button>
          </Col>
        </Row>
      }
    >
      <Container>
        <Text>In the unstake process you will withdraw all your stake balance and collect all the reward generated</Text>

        <Content>
          {stakedTokenIdList.map((item, index) => (
            <CardToken
              key={`${index}`}
              title='My Stake'
              showBalanceSymbol={false}
              token={{
                address: pool.token.id,
                id: item.tokenId,
                name: pool.token.name
              }}
              amount={item.amount}
              image={stakedNfts[index]?.metadata?.image}
              chainId={chainId}
            />
          ))}
          <CardToken
            title='Earned'
            native={pool.token.native}
            amount={myRewards}
            token={{ address: pool?.rewards[0].token.id, ...pool?.rewards[0].token }}
            image={pool.offchain?.earnTokenImage}
            chainId={chainId}
          />
          <Divider plain />
          <Text>Unstake amount</Text>
          {isLoadingStakedNfts && <CardLoader />}
          {!isLoadingStakedNfts && stakedTokenIdList.length > 0 && (
            <ListContent>
              {stakedTokenIdList.map(item => {
                return (
                  <ListItemNft
                    onChange={(tokenId, amount) => handleNftSelection(tokenId, String(amount))}
                    token={pool.token}
                    item={{
                      id: item.id || pool.token.id,
                      account: { id: item.account.id || '' },
                      tokenId: item.tokenId,
                      amount: item.amount
                    }}
                    key={`${item.id}#${item?.tokenId || ''}`}
                    type={pool.type}
                    image={stakedNfts.find(stakedNft => stakedNft.tokenId === item.tokenId)?.metadata?.image}
                    chainId={chainId}
                  />
                )
              })}
            </ListContent>
          )}
        </Content>
      </Container>
    </Modal>
  )
}

const { Container, Content, ListContent } = {
  Container: styled.div`
    display: grid;
    gap: 24px;
  `,
  ListContent: styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,

  Content: styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 4px;
  `
}
