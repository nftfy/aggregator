import { useReactiveVar } from '@apollo/client'
import { PoolStatus, RewardPool } from '@appTypes/pool/RewardPool'
import { Modal } from '@components/shared/design-system'
import { isManagePoolConfirmedVar } from '@graphql/variables/RewardPoolsVariables'
import { useStakingPool } from '@hook/shared/useStakingPool'
import { signerProviderVar, walletAccountVar } from '@nftfyorg/wallet'
import { useCallback, useEffect, useState } from 'react'
import { PoolERC721Modal } from '../pool-modal/PoolERC721Modal'
import { TokenTypeEnum } from './ChooseTypeModal'

export interface PoolProgramModalProps {
  tokenType: TokenTypeEnum
  onCancel: () => void
  chainId: number
  pool?: RewardPool
}

export function PoolProgramModal({ tokenType, onCancel, pool, chainId }: PoolProgramModalProps) {
  const signerProvider = useReactiveVar(signerProviderVar)
  const walletAccount = useReactiveVar(walletAccountVar)

  const { getPool } = useStakingPool({ chainId, poolAddress: pool?.address, accountAddress: walletAccount })

  const [inMemoryPool, setInMemoryPool] = useState<RewardPool | undefined>(pool)

  const [poolStatus, setPoolStatus] = useState<PoolStatus>(PoolStatus.COLLECTION_ADDRESS_PENDING)
  const [footerText, setFooterText] = useState<string | null>(null)
  const [hasPoolChanged, setHasPoolChanged] = useState(false)

  const modalTitle = poolStatus === PoolStatus.COLLECTION_ADDRESS_PENDING ? 'Create Program' : 'Edit Program'

  const handleOnCancel = () => {
    if (hasPoolChanged) {
      setHasPoolChanged(false)
      isManagePoolConfirmedVar(true)
    }

    onCancel()
  }

  const handleGetPool = useCallback(
    async (poolAddress: string): Promise<void> => {
      const data = await getPool({ poolAddress })

      setInMemoryPool(data.stakingPool)
      setHasPoolChanged(true)
    },
    [getPool]
  )

  useEffect(() => {
    if (!inMemoryPool?.address || !inMemoryPool?.token.id) {
      setPoolStatus(PoolStatus.COLLECTION_ADDRESS_PENDING)
      return
    }

    if (!inMemoryPool?.rewards.length || !inMemoryPool.rewards[0]?.token?.id) {
      setPoolStatus(PoolStatus.REWARD_ADDRESS_PENDING)
      return
    }

    if (!inMemoryPool?.rewards.length || !inMemoryPool.rewards[0]?.rewardPerSec) {
      setPoolStatus(PoolStatus.DAILY_REWARD_PENDING)
      return
    }

    setPoolStatus(PoolStatus.POOL_COMPLETE)
  }, [inMemoryPool])

  return signerProvider ? (
    <Modal title={modalTitle} visible closable onCancel={handleOnCancel} onOk={handleOnCancel} customFooter={footerText}>
      {
        {
          [TokenTypeEnum.ERC721]: (
            <PoolERC721Modal
              pool={inMemoryPool}
              onSetPoolStatus={setPoolStatus}
              onGetPool={handleGetPool}
              signerProvider={signerProvider}
              chainId={chainId}
              walletAccount={walletAccount}
              poolStatus={poolStatus}
              onSetFooterText={setFooterText}
            />
          ),
          [TokenTypeEnum.ERC20]: null,
          [TokenTypeEnum.NATIVE]: null,
          [TokenTypeEnum.LP_TOKEN]: null
        }[tokenType]
      }
    </Modal>
  ) : null
}
