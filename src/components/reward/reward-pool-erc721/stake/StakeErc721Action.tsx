import { RewardPool } from '@appTypes/pool/RewardPool'
import { SelectedNftStake } from '@appTypes/stake/SelectedNftStake'
import { Button } from '@components/shared/design-system'
import { Web3Provider } from '@ethersproject/providers'
import { Col, Row } from 'antd'

interface StakeErc721Props {
  pool: RewardPool
  chainId: number
  signerProvider?: Web3Provider | null
  setApprovalForAll: (signerProvider: Web3Provider, contractAddress: string, spenderAddress: string) => Promise<void>
  isApprovingUnlock: boolean
  isApprovedForAll: boolean
  isCheckingUnlock: boolean
  isStaking: boolean
  account: string
  walletChainId: number | null
  selectedItems: SelectedNftStake[]
  depositStake: (poolAddress: string, tokenIdList: string[], signerProvider: Web3Provider, chainId: number) => Promise<void>
}

export function StakeERC721Action({
  pool,
  account,
  chainId,
  signerProvider,
  isApprovingUnlock,
  setApprovalForAll,
  isApprovedForAll,
  isCheckingUnlock,
  walletChainId,
  isStaking,
  selectedItems,
  depositStake
}: StakeErc721Props) {
  const isButtonsDisabled = !signerProvider || !account

  return (
    <Row justify='center' gutter={[8, 0]}>
      {!isApprovedForAll && (
        <Col span={12}>
          <Button
            block
            type='primary'
            onClick={() => signerProvider && setApprovalForAll(signerProvider, pool.token.id, pool.address)}
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
          onClick={() =>
            signerProvider &&
            depositStake(
              pool.address,
              selectedItems.map(item => item.tokenId),
              signerProvider,
              chainId
            )
          }
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
