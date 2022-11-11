import { RewardPool } from '@appTypes/pool/RewardPool'
import { SelectedNftStake } from '@appTypes/stake/SelectedNftStake'
import { Button } from '@components/shared/design-system'
import { Col, Row } from 'antd'

interface StakeErc721Props {
  pool: RewardPool
  chainId: number
  setApprovalForAll?: () => void
  isApprovingUnlock: boolean
  isApprovedForAll: boolean
  isCheckingUnlock: boolean
  isStaking: boolean
  account: string
  walletChainId: number | null
  selectedItems: SelectedNftStake[]
  depositStake: () => void
}

export function StakeERC721Action({
  pool,
  account,
  chainId,
  isApprovingUnlock,
  setApprovalForAll,
  isApprovedForAll,
  isCheckingUnlock,
  walletChainId,
  isStaking,
  selectedItems,
  depositStake
}: StakeErc721Props) {
  const isButtonsDisabled = !account

  return (
    <Row justify='center' gutter={[8, 0]}>
      {!isApprovedForAll && (
        <Col span={12}>
          <Button
            block
            type='primary'
            onClick={setApprovalForAll}
            loading={isApprovingUnlock || isCheckingUnlock}
            skipStateValidation
            disabled={isButtonsDisabled}
          >
            Unlock
          </Button>
        </Col>
      )}
      <Col span={isApprovedForAll ? 24 : 12}>
        <Button
          block
          loading={isStaking}
          type='primary'
          onClick={depositStake}
          onChangeNetwork={() => console.log('mudarr aqui rede')}
          currentChainId={walletChainId}
          accountAddress={account}
          onConnectWallet={() => console.log('connect wallet')}
          chainId={chainId}
          disabled={account?.length > 0 && (!selectedItems.length || !isApprovedForAll)}
          skipStateValidation={false}
        >
          Confirm
        </Button>
      </Col>
    </Row>
  )
}
