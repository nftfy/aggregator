import { SelectedNftStake } from '@appTypes/stake/SelectedNftStake'
import { Button } from '@components/shared/design-system'
import { Col, Row } from 'antd'
import { useContext } from 'react'
import { useSwitchNetwork } from 'wagmi'
import { GlobalContext } from '../../../../../context/GlobalState'

interface StakeErc721Props {
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

  const { dispatch } = useContext(GlobalContext)
  const { switchNetwork } = useSwitchNetwork()
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
          onChangeNetwork={() => switchNetwork && switchNetwork(Number(process.env.NEXT_PUBLIC_CHAIN_ID))}
          currentChainId={walletChainId}
          accountAddress={account}
          onConnectWallet={() => {
            dispatch({ type: 'CONNECT_WALLET', payload: false })
          }}
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
