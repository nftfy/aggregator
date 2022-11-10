import { LoadingOutlined } from '@ant-design/icons'
import { switchNetwork } from '@wagmi/core'
import { Alert, Button, Col, Input, Row, Space, Typography } from 'antd'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import ConnectWalletButton from '../../../../../components/ConnectWalletButton'
import { chainConfig } from '../../../../ChainConfig'
import useSpecificJoinPool from '../../../../hook/rockpool/specific/useSpecificJoinPool'
import { RockpoolStatus, SpecificPoolItem } from '../../../../models/rockpool/SpecificPoolsTypes'
import { cryptoInputValidForm, formatToLocaleString } from '../../../../services/UtilService'

interface AddedParticipantsProps {
  chainId: number
  balance: string
  balanceLoading: boolean
  specificPublicItem: SpecificPoolItem
  userParticipation?: string
  signerProvider: ethers.providers.Web3Provider | null
  walletAddress?: string
  losePool: boolean
  winningPool: boolean
  refetchData: () => void
}

export default function AddedParticipants({
  chainId,
  balance,
  balanceLoading,
  userParticipation,
  specificPublicItem,
  refetchData,
  walletAddress,
  losePool,
  winningPool
}: AddedParticipantsProps) {
  const [depositAmount, setDepositAmount] = useState('0')
  const [maxJoinValue, setMaxJoinValue] = useState<string>('0')
  const [canJoin, setCanJoin] = useState<boolean>(false)
  console.log('can', canJoin)
  const walletChainId = 5 // TODO get reservo library info

  const isPoolInicialized = !new BigNumber(specificPublicItem.amount).gt('0')
  const isWalletWithoutBalance = !new BigNumber(balance).toNumber() || new BigNumber(depositAmount).gt(new BigNumber(balance))
  const config = chainConfig(chainId)
  const maxValueDeposit = new BigNumber(specificPublicItem.targetPrice).minus(specificPublicItem.amount)
  const poolIsCompleted = Number(specificPublicItem.poolProgress.replace('%', '')) >= 100
  const activePool = !!specificPublicItem && specificPublicItem.status === RockpoolStatus.CREATED && specificPublicItem.isErc721Available

  useEffect(() => {
    const maxPoolValue = new BigNumber(specificPublicItem.targetPrice).minus(specificPublicItem.amount)
    const balanceBigNumber = new BigNumber(balance)
    const maxValue = maxPoolValue.gt(balanceBigNumber) ? balanceBigNumber : maxPoolValue
    setMaxJoinValue(maxValue.toString())
  }, [balance, specificPublicItem])

  useEffect(() => {
    const joinValue = new BigNumber(depositAmount)

    setCanJoin(
      (!joinValue.isNaN && joinValue.gt(0) && joinValue.lte(maxJoinValue) && !!walletAddress) ||
        joinValue.gt(maxJoinValue) ||
        joinValue.isLessThanOrEqualTo(0) ||
        !depositAmount
    )
  }, [maxJoinValue, depositAmount, walletAddress])

  const { handleJoin, isExecutin: loadingJoin } = useSpecificJoinPool(
    chainId,
    walletAddress || '',
    specificPublicItem,
    depositAmount,
    refetchData
  )

  // const { handleLeave, isExecutin: loadingLeave } = useSpecificLeavePool(
  //   chainId,
  //   signerProvider,
  //   specificPublicItem,
  //   userParticipation || '0',
  //   refetchData
  // )

  // const handleRemoveParticipation = () => {
  //   Modal.confirm({
  //     title: 'Remove funds',
  //     icon: <ExclamationCircleOutlined />,
  //     content: `You have ${userParticipation || ''} ${config.nativeToken.symbol} of participation. Do you want to remove it?`,
  //     okText: 'Remove participation',
  //     cancelText: 'Cancel',
  //     onOk: async () => handleLeave(),
  //     cancelButtonProps: { style: { width: '100%', padding: '5px' } },
  //     okButtonProps: { style: { width: '100%', padding: '5px' } }
  //   })
  // }

  // const { handleSpecificAcquire, isExecutin: loadingAcquire } = useSpecificAcquire(
  //   chainId,
  //   signerProvider,
  //   specificPublicItem,
  //   walletAddress || '',
  //   refetchData
  // )

  const handleUseMax = () => {
    const maxValue = maxValueDeposit.gt(new BigNumber(balance)) ? new BigNumber(balance).toString() : maxValueDeposit.toString()
    setDepositAmount(maxValue)
  }

  const { Text } = Typography

  return (
    <Row gutter={[0, 16]}>
      <Col span={24}>
        {losePool && <Alert message='Pool lost' type='error' showIcon />}
        {!losePool && activePool && (
          <ContainerInput>
            <Text>Deposit amount</Text>
            <Input
              onChange={e => setDepositAmount(cryptoInputValidForm(e.target.value))}
              value={depositAmount}
              size='large'
              addonBefore={<span>{specificPublicItem.paymentToken.symbol || 'ETH'}</span>}
              disabled={poolIsCompleted}
              addonAfter={
                <Button type='text' onClick={handleUseMax} disabled={poolIsCompleted}>
                  Use max
                </Button>
              }
              defaultValue='0.0'
            />
            <Space>
              <Text type='secondary'>
                Balance: {balanceLoading ? <LoadingOutlined /> : formatToLocaleString(balance, 4)} {`${config.nativeToken.symbol}`}
              </Text>
              {isWalletWithoutBalance && !!walletAddress && !balanceLoading && <Text type='danger'>Not enough balance</Text>}
            </Space>
          </ContainerInput>
        )}
      </Col>
      <Col span={24}>
        {!walletAddress && <ConnectWalletButton className='w-full' />}
        {!winningPool &&
          (walletChainId !== chainId && walletAddress ? (
            <Button onClick={() => switchNetwork({ chainId: Number(chainId) })} type='primary' block style={{ height: '40px' }}>
              {`Change network to ${config.name}`}
            </Button>
          ) : (
            <>
              {poolIsCompleted && !losePool && walletAddress && (
                // <Button type='primary' block onClick={handleSpecificAcquire} loading={loadingAcquire}>
                //   buy NFT
                // </Button>
                <div>buy NFT</div>
              )}
              {!poolIsCompleted && !losePool && walletAddress && (
                <Button type='primary' block onClick={handleJoin} loading={loadingJoin} disabled={canJoin}>
                  {isPoolInicialized ? 'Start Pool' : 'Deposit Amount'}
                </Button>
              )}
              {new BigNumber(userParticipation || '0').gt('0') && (
                // <Button
                //   type='text'
                //   block
                //   onClick={handleRemoveParticipation}
                //   loading={loadingLeave}
                //   style={{ color: 'var(--primary-color)' }}
                // >
                //   Remove participation
                // </Button>
                <div>RemoveParticipation</div>
              )}
            </>
          ))}
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
