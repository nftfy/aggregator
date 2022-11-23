import { Button, Modal } from 'antd'
import BigNumber from 'bignumber.js'
import { useState } from 'react'
import { chainConfig } from '../../../ChainConfig'
import useFloorClaimFractions from '../../../hook/rockpool/buyFloor/useFloorClaimableFractions'
import { formatDecimals, formatToLocaleString, redirectToShowFractions } from '../../../services/UtilService'

interface ClaimFractionsModalProps {
  chainId: number
  data: {
    poolId: string
    amount?: string
    fractions: string
    fractionsCount?: string
    collectionName: string
  }
  walletAccount: string
  refetch: () => void
}

export default function ClaimFractionsFloorModal({ chainId, data, walletAccount, refetch }: ClaimFractionsModalProps) {
  const config = chainConfig(chainId)
  const [isOpen, setIsOpen] = useState(false)
  const { claimFractions } = useFloorClaimFractions(chainId, walletAccount, data.poolId, refetch)

  const showModal = () => {
    setIsOpen(true)
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  const handleClaimFractions = () => {
    if (!data.poolId) {
      return
    }
    claimFractions()
    setIsOpen(false)
  }

  return (
    <>
      {new BigNumber(data.fractionsCount || '').gt('0') ? (
        <Button block type='primary' onClick={showModal} style={{ width: 128 }}>
          Claim fractions
        </Button>
      ) : (
        <Button block type='primary' ghost style={{ width: 128 }} onClick={() => redirectToShowFractions(chainId, data.fractions)}>
          See fractions
        </Button>
      )}

      <Modal
        title='Claim fractions'
        open={isOpen}
        onCancel={handleCancel}
        okText='Claim'
        cancelText='Cancel'
        okButtonProps={{ block: true }}
        cancelButtonProps={{ block: true }}
        footer={[
          <div style={{ display: 'flex' }} key='1'>
            <Button block key='back' onClick={handleCancel}>
              Cancel
            </Button>
            <Button block type='primary' onClick={handleClaimFractions}>
              Claim
            </Button>
          </div>
        ]}
      >
        <div style={{ marginBottom: '1.4rem' }}>
          {' '}
          You have{' '}
          <strong>
            {' '}
            {formatDecimals(data?.amount || '0', 4)} {config.nativeToken.symbol}
          </strong>{' '}
          of participation, that is equal to{' '}
          <strong>
            {formatToLocaleString(data?.fractionsCount || '0', 4)} {data?.collectionName}
          </strong>{' '}
        </div>
        <span> Do you want to claim it?</span>
      </Modal>
    </>
  )
}
