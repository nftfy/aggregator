import { RewardPool } from '@appTypes/pool/RewardPool'

import { useErc721IsApprovedForAll } from '../../../../hook/reward/erc721/useErc721IsApprovedForAll'
import { useErc721SetApprovalForAll } from '../../../../hook/reward/erc721/useErc721SetApprovalForAll'
import { SelectedNftStake } from '../../../../types/stake/SelectedNftStake'
import { Modal } from '../../../shared/design-system'

import { useNetwork } from 'wagmi'
import { StakeErc721 } from './StakeErc721'
import { StakeERC721Action } from './StakeErc721Action'

interface StakeErc721Props {
  pool: RewardPool
  chainIdPage: number
  account: string
  visible: boolean
  selectedItems: SelectedNftStake[]
  isLoading: boolean
  setSelectedItems: (items: SelectedNftStake[]) => void
  onConfirm: (items: SelectedNftStake[]) => void
  depositStake: () => void
  stakeTokenImage?: string
  onClose?: () => void
}

export function StakeModal({
  pool,
  account,
  chainIdPage,
  stakeTokenImage,
  visible,
  selectedItems,
  isLoading,
  depositStake,
  setSelectedItems,
  onConfirm,
  onClose
}: StakeErc721Props) {
  const network = useNetwork()
  const { isLoading: isApprovingUnlock, setApprovalForAll, status: unlockStatus } = useErc721SetApprovalForAll(pool.token.id, pool.address)
  const {
    refetch: refetchUnlock,
    isApprovedForAll,
    isLoading: isCheckingUnlock
  } = useErc721IsApprovedForAll(pool.token.id, account, pool.address, chainIdPage)

  const handleSetApprovalForAll = () => {
    if (setApprovalForAll) {
      setApprovalForAll()
    }
  }
  return (
    <Modal
      title={pool.hasStake ? 'Add more stake' : 'Stake'}
      visible={visible}
      onCancel={onClose}
      closable
      customFooter={
        <StakeERC721Action
          account={account}
          chainId={chainIdPage}
          isApprovingUnlock={isApprovingUnlock}
          setApprovalForAll={handleSetApprovalForAll}
          isApprovedForAll={isApprovedForAll}
          isCheckingUnlock={isCheckingUnlock}
          walletChainId={network.chain?.id ?? null}
          isStaking={isLoading}
          selectedItems={selectedItems}
          depositStake={depositStake}
        />
      }
    >
      <StakeErc721
        pool={pool}
        chainIdPage={chainIdPage}
        account={account}
        stakeStatus={false}
        stakeTokenImage={stakeTokenImage}
        unlockStatus={unlockStatus}
        isApprovingUnlock={isApprovingUnlock}
        isApprovedForAll={isApprovedForAll}
        onConfirm={onConfirm}
        refetchUnlock={refetchUnlock}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
    </Modal>
  )
}
