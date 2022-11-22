import { Button, Modal } from 'antd'
import BigNumber from 'bignumber.js'
import { useState } from 'react'
import { chainConfig } from '../../../ChainConfig'
import useClaimFractions from '../../../hook/rockpool/specific/useClaimFractions'
import { formatDecimals, formatToLocaleString, redirectToShowFractions } from '../../../services/UtilService'

interface ClaimFractionsSpecificModalProps {
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

export default function ClaimFractionsSpecificModal({ chainId, data, walletAccount, refetch }: ClaimFractionsSpecificModalProps) {
  const config = chainConfig(chainId)
  const [isOpen, setIsOpen] = useState(false)

  const handleSuccessClaim = () => {
    refetch()
    setIsOpen(false)
  }
  const { handleClaimFractions, isLoading } = useClaimFractions(chainId, data.poolId, walletAccount, handleSuccessClaim)
  const showModal = () => {
    setIsOpen(true)
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  return (
    <>
      {new BigNumber(data.fractionsCount || '').gt('0') ? (
        <Button block type='primary' onClick={showModal}>
          Claim fractions
        </Button>
      ) : (
        <Button block type='primary' ghost onClick={() => redirectToShowFractions(chainId, data.fractions)}>
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
            <Button block type='primary' onClick={handleClaimFractions} loading={isLoading}>
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
