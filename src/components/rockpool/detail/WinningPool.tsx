import { switchNetwork } from '@wagmi/core'
import { Alert, Button, Col, Modal, Row } from 'antd'
import BigNumber from 'bignumber.js'
import { useNetwork } from 'wagmi'
import { chainConfig } from '../../../ChainConfig'
import { Buyer } from '../../../graphql/nftfy/rockpool/SpecificPoolItemBuyer'
import useClaimFractions from '../../../hook/rockpool/specific/useClaimFractions'
import { SpecificPoolItem } from '../../../models/rockpool/SpecificPoolsTypes'
import { formatDecimals } from '../../../services/UtilService'

interface ParticipantsProps {
  chainId: number
  userBuyer: Buyer | undefined
  specificPublicItem: SpecificPoolItem
  walletAddress: string

  refetch: () => void
}

export default function WinningPool({ specificPublicItem, walletAddress, refetch, chainId, userBuyer }: ParticipantsProps) {
  const config = chainConfig(chainId)
  const { chain: activeChain } = useNetwork()
  const walletChainId = activeChain?.id
  const { handleClaimFractions } = useClaimFractions(chainId, specificPublicItem?.id, walletAddress, refetch)

  const handleClaim = () => {
    Modal.confirm({
      title: 'Claim fractions',
      content: (
        <span>
          {' '}
          You have{' '}
          <strong>
            {Number(userBuyer?.amount).toFixed(4)} {specificPublicItem?.paymentToken.symbol}
          </strong>{' '}
          of participation, that is equal to{' '}
          <strong>
            {formatDecimals(userBuyer?.fractionsCount || '0', 4)} {specificPublicItem?.target.collection.name}
          </strong>{' '}
          Do you want to claim it?
        </span>
      ),
      okText: 'Claim',
      cancelText: 'Cancel',
      onOk: async () => {
        await handleClaimFractions()
      }
    })
  }

  return (
    <Row gutter={[0, 16]}>
      <Col span={24}>
        <Alert message='Winning Pool' type='success' showIcon />
      </Col>
      {userBuyer && new BigNumber(userBuyer.fractionsCount || '0').gt(new BigNumber('0')) && (
        <Col span={24}>
          {walletChainId !== chainId ? (
            <Button onClick={() => switchNetwork({ chainId: Number(chainId) })} type='primary' block style={{ height: '40px' }}>
              {`Change network to ${config.name}`}
            </Button>
          ) : (
            <Button onClick={handleClaim} type='primary' size='large' block>
              Claim
            </Button>
          )}
        </Col>
      )}
    </Row>
  )
}
