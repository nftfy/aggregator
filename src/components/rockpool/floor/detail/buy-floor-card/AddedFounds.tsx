import { ExclamationCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import { switchNetwork } from '@wagmi/core'
import { Alert, Button, Col, Input, Modal, Row, Space, Typography } from 'antd'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { useState } from 'react'
import styled from 'styled-components'
import { useNetwork } from 'wagmi'
import ConnectWalletButton from '../../../../../../components/ConnectWalletButton'
import { chainConfig } from '../../../../../ChainConfig'
import useBuyFloorAcquirerV2 from '../../../../../hook/rockpool/buyFloor/useBuyFloorAcqquirer'
import usePerpetualJoin from '../../../../../hook/rockpool/buyFloor/usePerpetualJoin'
import usePerpetualLeave from '../../../../../hook/rockpool/buyFloor/usePerpetualLeave'
import { BuyFloorStatus } from '../../../../../models/rockpool/floor/BuyFloorStatusEnum'
import { cryptoInputValidForm, formatToLocaleString, units } from '../../../../../services/UtilService'

interface AddedFoundsProps {
  chainId: number
  remainingAmount?: string
  targetPrice?: string
  reservePrice?: string
  balance: string
  balanceLoading: boolean
  collectionAddress: string
  poolId?: string
  poolProgressStatus: BuyFloorStatus
  userParticipation?: string
  walletAccount: string
  tokenId: string
  refetchData: () => void
}

export default function AddedFounds({
  poolId,
  collectionAddress,
  reservePrice,
  chainId,
  targetPrice,
  remainingAmount,
  balance,
  balanceLoading,
  poolProgressStatus,
  userParticipation,
  walletAccount,
  tokenId,
  refetchData
}: AddedFoundsProps) {
  const [depositAmount, setDepositAmount] = useState('0')
  const { chain: activeChain } = useNetwork()
  const walletChainId = activeChain?.id

  const config = chainConfig(chainId)
  const remainingAmountAvailable = remainingAmount || targetPrice || '0'
  const isUserNotEnabledToJoin =
    (!reservePrice && !new BigNumber(balance).toNumber()) || poolProgressStatus === BuyFloorStatus.NO_ITEM_AVAILABLE
  const isPoolNeverInitialized = !poolId || [BuyFloorStatus.ENDED, BuyFloorStatus.NO_ITEM_AVAILABLE].includes(poolProgressStatus)
  const isFieldGreaterThanRemaining = new BigNumber(depositAmount).gt(remainingAmountAvailable)
  const isWalletWithoutBalance = !new BigNumber(balance).toNumber() || new BigNumber(depositAmount).gt(new BigNumber(balance))

  const isJoinButtonDisabled =
    isUserNotEnabledToJoin ||
    !new BigNumber(depositAmount).toNumber() ||
    (isPoolNeverInitialized && isFieldGreaterThanRemaining) ||
    isFieldGreaterThanRemaining ||
    isWalletWithoutBalance

  const canBuyNft = poolProgressStatus === BuyFloorStatus.TARGET_ACHIEVED
  const { handleJoin, isExecutin: isLoadingJoin } = usePerpetualJoin(
    chainId,
    collectionAddress,
    config.nativeToken.address,
    !!depositAmount
      ? ethers.BigNumber.from(units(depositAmount.slice(-1) === '.' ? depositAmount + '0' : depositAmount, config.nativeToken.decimals))
      : ethers.BigNumber.from('0'),
    ethers.BigNumber.from(units(reservePrice || '0', config.nativeToken.decimals)),
    Number(poolId),
    refetchData
  )

  const { handleLeave, isExecutin: isLoadingLeave } = usePerpetualLeave(
    chainId,
    collectionAddress,
    config.nativeToken.address,
    userParticipation || '0',
    refetchData
  )

  const { handleSpecificAcquire, isExecutin: isLoadingAcquirer } = useBuyFloorAcquirerV2(
    chainId,
    tokenId,
    poolId || '',
    canBuyNft,
    collectionAddress,
    refetchData
  )

  const handleRemoveParticipation = () => {
    Modal.confirm({
      title: 'Remove funds',
      icon: <ExclamationCircleOutlined />,
      content: `You have ${userParticipation || ''} ${config.nativeToken.symbol} of participation. Do you want to remove it?`,
      okText: 'Remove participation',
      cancelText: 'Cancel',
      onOk: async () => handleLeave(),
      cancelButtonProps: { style: { width: '100%', padding: '5px' } },
      okButtonProps: { style: { width: '100%', padding: '5px' } }
    })
  }

  const handleUseMax = () => {
    if (isUserNotEnabledToJoin) return
    const maxValue = new BigNumber(balance).gte(remainingAmountAvailable) ? remainingAmountAvailable : balance
    setDepositAmount(maxValue || '0')
  }

  const { Text } = Typography

  return (
    <Row gutter={[0, 16]}>
      <Col span={24}>
        {canBuyNft ? (
          <Alert message='Winning Pool' type='success' showIcon closable />
        ) : (
          <ContainerInput>
            <Text>Deposit amount</Text>
            <Input
              onChange={e => setDepositAmount(cryptoInputValidForm(e.target.value))}
              value={depositAmount}
              size='large'
              addonBefore={<span>ETH</span>}
              disabled={isUserNotEnabledToJoin || canBuyNft}
              addonAfter={
                <Button type='text' onClick={handleUseMax} disabled={isUserNotEnabledToJoin || canBuyNft} style={{ padding: 0, width: 78 }}>
                  Use max
                </Button>
              }
              defaultValue='0.0'
            />
            <Space>
              <Text type='secondary'>
                Balance: {balanceLoading ? <LoadingOutlined /> : formatToLocaleString(balance, 4)} {`${config.nativeToken.symbol}`}
              </Text>
              {(!canBuyNft && walletAccount && isWalletWithoutBalance && !balanceLoading && (
                <Text type='danger'>Not enough balance</Text>
              )) ||
                ''}
            </Space>
          </ContainerInput>
        )}
      </Col>
      <Col span={24}>
        {!walletAccount ? (
          <ConnectWalletButton className='w-full' />
        ) : (
          <>
            {walletChainId !== chainId ? (
              <Button onClick={() => switchNetwork({ chainId: Number(chainId) })} type='primary' block style={{ height: '40px' }}>
                {`Change network to ${config.name}`}
              </Button>
            ) : (
              <>
                {!canBuyNft && (
                  <Button type='primary' disabled={isJoinButtonDisabled} block onClick={handleJoin} loading={isLoadingJoin}>
                    {isPoolNeverInitialized ? 'Start Pool' : 'Add funds'}
                  </Button>
                )}
                {canBuyNft && (
                  <Button type='primary' disabled={false} block onClick={handleSpecificAcquire} loading={isLoadingAcquirer}>
                    Buy Floor
                  </Button>
                )}
              </>
            )}

            {!isPoolNeverInitialized && new BigNumber(userParticipation || '0').gt('0') && (
              <Button
                type='text'
                block
                onClick={handleRemoveParticipation}
                disabled={new BigNumber(userParticipation || '0').isEqualTo('0')}
                loading={isLoadingLeave}
                style={{ color: 'var(--primary-color)' }}
              >
                Remove funds
              </Button>
            )}
          </>
        )}
      </Col>
    </Row>
  )
}

const { ContainerInput } = {
  ContainerInput: styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  `
}
