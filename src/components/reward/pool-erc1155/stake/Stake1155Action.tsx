import { SelectedNftStake } from '@appTypes/stake/SelectedNftStake'
import { Button } from '@components/shared/design-system'
import { Col, Row } from 'antd'
import { useContext } from 'react'
import { useSwitchNetwork } from 'wagmi'
import { GlobalContext } from '../../../../../context/GlobalState'

interface StakeERC1155ActionProps {
  chainId: number
  setApprovalForAll?: () => void
  isLoadingUnlock: boolean
  isApprovedForAll: boolean
  account: string
  walletChainId: number | null
  selectedItems: SelectedNftStake[]
  isLoadingStakeErc1155: boolean
  deposit?: () => void
}

export function StakeERC1155Action({
  account,
  chainId,
  setApprovalForAll,
  isApprovedForAll,
  walletChainId,
  selectedItems,
  isLoadingUnlock,
  isLoadingStakeErc1155,
  deposit
}: StakeERC1155ActionProps) {
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
            shape='default'
            loading={isLoadingUnlock}
            skipStateValidation
            onClick={() => setApprovalForAll && setApprovalForAll()}
            disabled={isButtonsDisabled}
          >
            Unlock
          </Button>
        </Col>
      )}
      <Col span={isApprovedForAll ? 24 : 12}>
        <Button
          block
          type='primary'
          shape='default'
          loading={isLoadingStakeErc1155}
          onChangeNetwork={() => switchNetwork && switchNetwork(Number(process.env.NEXT_PUBLIC_CHAIN_ID))}
          currentChainId={walletChainId}
          accountAddress={account}
          onConnectWallet={() => {
            dispatch({ type: 'CONNECT_WALLET', payload: false })
          }}
          chainId={chainId}
          skipStateValidation={false}
          disabled={account?.length > 0 && (!selectedItems.length || !isApprovedForAll)}
          onClick={() => !isButtonsDisabled && deposit && deposit()}
        >
          Confirm
        </Button>
      </Col>
    </Row>
  )
}
