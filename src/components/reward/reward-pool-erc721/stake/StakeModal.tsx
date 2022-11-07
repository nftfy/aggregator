import { RewardPool } from '@appTypes/pool/RewardPool'
import { Web3Provider } from '@ethersproject/providers'

import { useState } from 'react'
import { useErc721IsApprovedForAll } from '../../../../hook/contracts/erc721/useErc721IsApprovedForAll'
import { useErc721SetApprovalForAll } from '../../../../hook/contracts/erc721/useErc721SetApprovalForAll'
import { useRewardPoolErc721Deposit } from '../../../../hook/contracts/reward-pool-erc721/useRewardPoolErc721Deposit'
import { SelectedNftStake } from '../../../../types/stake/SelectedNftStake'
import { Modal } from '../../../shared/design-system'

import { StakeErc721 } from './StakeErc721'
import { StakeERC721Action } from './StakeErc721Action'

interface StakeErc721Props {
  pool: RewardPool
  chainIdPage: number
  signerProvider: Web3Provider
  stakeTokenImage?: string
  account: string
  visible: boolean
  onConfirm: () => void
  onClose?: () => void
}

export function StakeModal({ pool, account, chainIdPage, signerProvider, stakeTokenImage, visible, onConfirm, onClose }: StakeErc721Props) {
  const [selectedItems, setSelectedItems] = useState<SelectedNftStake[]>([])

  const walletChainId = 5

  const { isLoading: isApprovingUnlock, setApprovalForAll, status: unlockStatus } = useErc721SetApprovalForAll()
  const {
    refetch: refetchUnlock,
    isApprovedForAll,
    isLoading: isCheckingUnlock
  } = useErc721IsApprovedForAll(pool.token.id, account, pool.address, chainIdPage)

  const { isLoading: isStaking, status: stakeStatus, deposit: depositStake } = useRewardPoolErc721Deposit()

  return (
    <Modal
      title={pool.hasStake ? 'Add more stake' : 'Stake'}
      visible={visible}
      onCancel={onClose}
      closable
      customFooter={
        <StakeERC721Action
          pool={pool}
          account={account}
          chainId={chainIdPage}
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
      }
    >
      <StakeErc721
        pool={pool}
        chainIdPage={chainIdPage}
        account={account}
        stakeStatus={stakeStatus}
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
