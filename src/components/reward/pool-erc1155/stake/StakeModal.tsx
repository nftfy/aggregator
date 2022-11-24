import { SelectedNftStake } from '@appTypes/stake/SelectedNftStake'

import { RewardPool } from '@appTypes/pool/RewardPool'
import { Modal } from '@components/shared/design-system'

import { useNetwork } from 'wagmi'
import { useErc1155ApproveForAll } from '../../../../hook/reward/erc1155/useErc1155ApproveForAll'
import { StakeERC1155 } from './Stake1155'
import { StakeERC1155Action } from './Stake1155Action'

interface StakeERC20ModalProps {
  title: string
  pool: RewardPool
  chainIdPage: number
  visible: boolean
  account: string
  isLoading: boolean
  selectedItems: SelectedNftStake[]
  setSelectedItems: (items: SelectedNftStake[]) => void
  onConfirm: (items: SelectedNftStake[]) => void
  onClose?: () => void
  deposit: () => void
  stakePoolImage?: string
  stakedAmount: string
}

export function StakeModal({
  visible,
  onConfirm,
  onClose,
  pool,
  chainIdPage,
  selectedItems,
  setSelectedItems,
  isLoading,
  account,
  deposit,
  stakePoolImage,
  title,
  stakedAmount
}: StakeERC20ModalProps) {
  const network = useNetwork()

  const {
    isLoading: isLoadingUnlock,
    isApprovedForAll,
    setApprovalForAll,
    status
  } = useErc1155ApproveForAll(chainIdPage, pool.token.id, pool.address, account)

  const onSelectItem = (tokenId: string, amount: string, image: string) => {
    const selectedItemsToUpdate = selectedItems.filter(item => item.tokenId !== tokenId)

    if (!amount || !+amount) {
      setSelectedItems(selectedItemsToUpdate)
      return
    }

    setSelectedItems(selectedItemsToUpdate.concat({ tokenId, amount, image }))
  }
  const handleConfirm = () => {
    onConfirm(selectedItems)
  }

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onClose}
      onOk={handleConfirm}
      closable
      customFooter={
        <StakeERC1155Action
          account={account}
          chainId={chainIdPage}
          setApprovalForAll={setApprovalForAll}
          isApprovedForAll={isApprovedForAll}
          walletChainId={network.chain?.id ?? null}
          selectedItems={selectedItems}
          isLoadingUnlock={isLoadingUnlock}
          isLoadingStakeErc1155={isLoading}
          deposit={deposit}
        />
      }
    >
      <StakeERC1155
        onSelectItem={onSelectItem}
        pool={pool}
        chainIdPage={chainIdPage}
        account={account}
        isApprovedForAll={isApprovedForAll}
        status={status}
        stakePoolImage={stakePoolImage}
        stakedAmount={stakedAmount}
      />
    </Modal>
  )
}
