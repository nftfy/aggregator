import { PoolStatus, RewardPool } from '@appTypes/pool/RewardPool'
import { TokenImage } from '@components/shared/TokenImage'
import { Web3Provider } from '@ethersproject/providers'
import { useErc721Transfer } from '@hook/contracts/erc721/useErc721Transfer'
import { useErc20Balance } from '@hook/erc20/useErc20Balance'
import { toHumanFormat } from '@services/UtilService'
import { Button, Form, Input, message } from 'antd'
import type { FormInstance } from 'antd/es/form'
import BigNumber from 'bignumber.js'
import { useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'

interface PoolFormTotalRewardsProps {
  signerProvider: Web3Provider
  walletAccount: string
  chainId: number
  pool?: RewardPool
  poolStatus: PoolStatus
  form: FormInstance
  onSetFooterText: (text: string) => void
}

export function PoolFormTotalRewards({
  pool,
  chainId,
  signerProvider,
  walletAccount,
  form,
  poolStatus,
  onSetFooterText
}: PoolFormTotalRewardsProps) {
  const totalRewardsFieldValue = Form.useWatch('totalRewards', form) as string
  const isPoolWithRewards = pool?.rewards && pool?.rewards.length
  const dailyRewardFieldValue = Form.useWatch('dailyReward', form) as string

  const erc721Transfer = useErc721Transfer(signerProvider)

  const {
    loading: isBalanceLoading,
    erc20Balance,
    refetch: getErc20Balance
  } = useErc20Balance(chainId, walletAccount, pool?.rewards?.at(0)?.token.id, pool?.rewards?.at(0)?.token?.decimals)

  const isDepositButtonDisabled = useMemo(
    () =>
      !+totalRewardsFieldValue ||
      new BigNumber(totalRewardsFieldValue).isLessThanOrEqualTo(0) ||
      new BigNumber(totalRewardsFieldValue).isGreaterThan(erc20Balance),
    [totalRewardsFieldValue, erc20Balance]
  )

  const onDeposit = async (totalRewardAmount: string) => {
    const rewardAddress = form.getFieldValue('rewardAddress') as string

    if (!pool?.address || !rewardAddress || !totalRewardAmount) {
      return
    }

    const totalRewardAmountWithFixedDecimals = new BigNumber(totalRewardAmount)
      .toFixed(pool?.rewards[0]?.token.decimals ?? 18, BigNumber.ROUND_CEIL)
      .replace('.', '')

    await erc721Transfer.transfer(rewardAddress, pool.address, totalRewardAmountWithFixedDecimals)
  }

  const handleUseMax = () => {
    if (!+erc20Balance) {
      return
    }

    form.setFieldValue('totalRewards', new BigNumber(erc20Balance).toFixed(pool?.rewards[0]?.token.decimals ?? 18, BigNumber.ROUND_CEIL))
  }
  const handleSetFooterText = useCallback(
    (dailyReward: string, days: number) => {
      const daySingularOrPlural = days <= 0 ? 'day' : 'days'
      onSetFooterText([toHumanFormat(+dailyReward), 'Rewards per', days, daySingularOrPlural].join(' '))
    },
    [onSetFooterText]
  )

  useEffect(() => {
    if (erc721Transfer.status === 'success') {
      message.success('Deposit has successfully sent')
      form.setFieldValue('totalRewards', '0')
      getErc20Balance()
      erc721Transfer.dismiss()
    }
  }, [getErc20Balance, form, erc721Transfer.status, erc721Transfer])

  useEffect(() => {
    if (isPoolWithRewards) {
      getErc20Balance()
    }
  }, [isPoolWithRewards, getErc20Balance])

  useEffect(() => {
    if (totalRewardsFieldValue) {
      if (dailyRewardFieldValue) {
        const days = new BigNumber(totalRewardsFieldValue).dividedBy(dailyRewardFieldValue).toNumber()
        handleSetFooterText(dailyRewardFieldValue, days)
        return
      }

      handleSetFooterText('0', 0)
    }
  }, [handleSetFooterText, dailyRewardFieldValue, totalRewardsFieldValue])

  return (
    <Form.Item shouldUpdate={(prev, next) => prev !== next} noStyle>
      {({ getFieldValue, setFieldValue }) => (
        <Form.Item
          label='Rewards Amount'
          name='totalRewards'
          rules={[{ required: true, message: 'Please input your total amount of rewards!' }]}
          tooltip='Total amount of rewards to be distributed'
          extra={
            isPoolWithRewards && (
              <div>
                {isBalanceLoading ? 'loading... ' : ['Balance:', toHumanFormat(+erc20Balance), pool.rewards[0].token.symbol].join(' ')}
              </div>
            )
          }
        >
          <InputBalanceGroup compact size='default' style={{ display: 'flex' }}>
            <Input
              defaultValue={0}
              value={getFieldValue('totalRewards')}
              onChange={e => setFieldValue('totalRewards', e.target.value)}
              type='number'
              min={0}
              max={erc20Balance}
              addonBefore={isPoolWithRewards && pool.rewards[0].token.symbol}
              prefix={
                isPoolWithRewards && (
                  <TokenImage diameter={16} address={pool.rewards[0].token.id} src={pool.offchain?.earnTokenImage} shape='square' />
                )
              }
              suffix={
                isPoolWithRewards && (
                  <Button type='text' size='small' disabled={erc721Transfer.isLoading} onClick={handleUseMax}>
                    Max
                  </Button>
                )
              }
              disabled={
                poolStatus === PoolStatus.COLLECTION_ADDRESS_PENDING ||
                poolStatus === PoolStatus.REWARD_ADDRESS_PENDING ||
                erc721Transfer.isLoading
              }
            />
            <Button
              type='primary'
              style={{ height: 'auto' }}
              disabled={
                !getFieldValue('totalRewards') ||
                poolStatus === PoolStatus.COLLECTION_ADDRESS_PENDING ||
                poolStatus === PoolStatus.REWARD_ADDRESS_PENDING ||
                isDepositButtonDisabled ||
                erc721Transfer.isLoading
              }
              onClick={() => onDeposit(getFieldValue('totalRewards') as string)}
              loading={erc721Transfer.isLoading}
            >
              Deposit
            </Button>
          </InputBalanceGroup>
        </Form.Item>
      )}
    </Form.Item>
  )
}

const { InputBalanceGroup } = {
  InputBalanceGroup: styled(Input.Group)`
    display: flex !important;

    .ant-input-group-wrapper {
      > .ant-input-wrapper {
        height: 100% !important;
      }

      .ant-input-affix-wrapper {
        height: 100% !important;
        border-top-right-radius: unset;
        border-bottom-right-radius: unset;
      }
    }
  `
}
