import { SelectedNftStake } from '@appTypes/stake/SelectedNftStake'

import { useState } from 'react'

import { RewardPool } from '@appTypes/pool/RewardPool'
import { Modal } from '@components/shared/design-system'
import { Web3Provider } from '@ethersproject/providers'

import { useErc1155ApproveForAll } from '../../../../hook/reward/erc1155/useErc1155ApproveForAll'
import { useStakeErc1155 } from '../../../../hook/reward/pool-erc1155/useRewardPoolErc1155Deposit'
import { StakeERC1155 } from './Stake1155'
import { StakeERC1155Action } from './Stake1155Action'

interface StakeERC20ModalProps {
  title: string
  pool: RewardPool
  chainIdPage: number
  visible: boolean
  account: string
  signerProvider: Web3Provider
  onConfirm: () => void
  onClose?: () => void
  stakePoolImage?: string
  stakedAmount: string
}

export function StakeModal({
  visible,
  onConfirm,
  onClose,
  pool,
  chainIdPage,
  account,
  signerProvider,
  stakePoolImage,
  title,
  stakedAmount
}: StakeERC20ModalProps) {
  const walletChainId = 5

  const [selectedItems, setSelectedItems] = useState<SelectedNftStake[]>([])

  const {
    isLoading: isLoadingUnlock,
    isApprovedForAll,
    setApprovalForAll
  } = useErc1155ApproveForAll(chainIdPage, pool.token.id, pool.address, account)
  const { isLoading: isLoadingStakeErc1155, deposit, status } = useStakeErc1155()

  const onSelectItem = (tokenId: string, amount: string, image: string) => {
    const selectedItemsToUpdate = selectedItems.filter(item => item.tokenId !== tokenId)

    if (!amount || !+amount) {
      setSelectedItems(selectedItemsToUpdate)
      return
    }

    setSelectedItems(selectedItemsToUpdate.concat({ tokenId, amount, image }))
  }

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onClose}
      onOk={onConfirm}
      closable
      customFooter={
        <StakeERC1155Action
          deposit={deposit}
          pool={pool}
          account={account}
          chainId={chainIdPage}
          signerProvider={signerProvider}
          setApprovalForAll={setApprovalForAll}
          isApprovedForAll={isApprovedForAll}
          walletChainId={walletChainId}
          selectedItems={selectedItems}
          isLoadingUnlock={isLoadingUnlock}
          isLoadingStakeErc1155={isLoadingStakeErc1155}
        />
      }
    >
      <StakeERC1155
        onSelectItem={onSelectItem}
        selectedItems={selectedItems}
        pool={pool}
        chainIdPage={chainIdPage}
        handleStakeConfirmed={onConfirm}
        account={account}
        isApprovedForAll={isApprovedForAll}
        status={status}
        stakePoolImage={stakePoolImage}
        stakedAmount={stakedAmount}
      />
    </Modal>
  )
}
