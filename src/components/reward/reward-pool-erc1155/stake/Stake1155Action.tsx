import { RewardPool } from '@appTypes/pool/RewardPool'
import { SelectedNftStake } from '@appTypes/stake/SelectedNftStake'
import { Button } from '@components/shared/design-system'
import { Web3Provider } from '@ethersproject/providers'
import { Col, Row } from 'antd'

interface StakeERC1155ActionProps {
  pool: RewardPool
  chainId: number
  signerProvider?: Web3Provider | null
  setApprovalForAll: (signerProvider: Web3Provider, contractAddress: string, spenderAddress: string) => Promise<void>
  isLoadingUnlock: boolean
  isApprovedForAll: boolean
  account: string
  walletChainId: number | null
  selectedItems: SelectedNftStake[]
  isLoadingStakeErc1155: boolean
  deposit: (poolAddress: string, tokenIdList: string[], amounts: string[], signerProvider: Web3Provider, chainId: number) => Promise<void>
}

export function StakeERC1155Action({
  pool,
  account,
  chainId,
  signerProvider,
  setApprovalForAll,
  isApprovedForAll,
  walletChainId,
  selectedItems,
  isLoadingUnlock,
  isLoadingStakeErc1155,
  deposit
}: StakeERC1155ActionProps) {
  const isButtonsDisabled = !signerProvider || !account

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
            onClick={() => signerProvider && setApprovalForAll(signerProvider, pool.token.id, pool.address)}
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
          onChangeNetwork={()=>console.log('change network')}
          currentChainId={walletChainId}
          accountAddress={account}
          onConnectWallet={()=>console.log('connect wallet')}
          chainId={chainId}
          skipStateValidation={false}
          disabled={account?.length > 0 && (!selectedItems.length || !isApprovedForAll)}
          onClick={() =>
            !isButtonsDisabled &&
            deposit(
              pool.address,
              selectedItems.map(item => item.tokenId),
              selectedItems.map(item => item.amount),
              signerProvider,
              chainId
            )
          }
        >
          Confirm
        </Button>
      </Col>
    </Row>
  )
}
