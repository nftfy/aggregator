import { PoolStatus, RewardPool } from '@appTypes/pool/RewardPool'
import { Web3Provider } from '@ethersproject/providers'
import { useRewardPoolErc721RewardPerSec } from '@hook/contracts/reward-pool-erc721/useRewardPoolErc721RewardPerSec'
import { toHumanFormat } from '@services/UtilService'
import { Button, Form, Input, message } from 'antd'
import type { FormInstance } from 'antd/es/form'
import BigNumber from 'bignumber.js'
import { useCallback, useEffect } from 'react'

interface PoolFormDailyRewardsProps {
  signerProvider: Web3Provider
  chainId: number
  pool?: RewardPool
  form: FormInstance
  poolStatus: PoolStatus
  onSetPoolStatus: (status: PoolStatus) => void
  onSetFooterText: (text: string) => void
}
export function PoolFormDailyRewards({
  pool,
  chainId,
  signerProvider,
  form,
  poolStatus,
  onSetPoolStatus,
  onSetFooterText
}: PoolFormDailyRewardsProps) {
  const dailyRewardFieldValue = Form.useWatch('dailyReward', form) as string
  const totalRewardsFieldValue = Form.useWatch('totalRewards', form) as string
  const isPoolWithRewards = pool?.rewards && pool?.rewards.length
  const rewardPerSec = useRewardPoolErc721RewardPerSec(chainId, signerProvider)

  const onUpdateRewardPerSec = (dailyReward: string) => {
    const rewardAddress = form.getFieldValue('rewardAddress') as string

    if (!pool?.address || !rewardAddress || !dailyReward) {
      return
    }

    const rewardsPerSecondWithFixedDecimals = getRewardsPerSecondDaily(dailyReward)
    rewardPerSec.updateRewardPerSec(pool.address, rewardAddress, rewardsPerSecondWithFixedDecimals)
  }

  const handleSetFooterText = useCallback(
    (dailyReward: string, days: number) => {
      onSetFooterText([toHumanFormat(+dailyReward), 'Rewards per', days, 'days'].join(' '))
    },
    [onSetFooterText]
  )

  const getRewardsPerSecondDaily = (amountPerDay: string) => {
    const total = new BigNumber(amountPerDay).dividedBy(60).dividedBy(60).dividedBy(24)

    return total.toFixed(pool?.rewards[0]?.token.decimals ?? 18, BigNumber.ROUND_CEIL).replace('.', '')
  }

  const getDailyRewardsPerSecond = useCallback(
    (amountPerSecond: string) => {
      const total = new BigNumber(amountPerSecond).multipliedBy(60).multipliedBy(60).multipliedBy(24)
      const [totalValue, totalDecimals] = total.toString().split('.')

      if (!totalDecimals) {
        return totalValue
      }

      const tokenDecimals = pool?.rewards[0]?.token.decimals ?? 18
      if (totalDecimals?.length <= tokenDecimals) {
        return total.toString()
      }

      return total.toFixed(tokenDecimals).toString()
    },
    [pool]
  )

  useEffect(() => {
    if (rewardPerSec.status === 'success') {
      message.success('Daily reward has successfully updated ')
      onSetPoolStatus(PoolStatus.POOL_COMPLETE)
      rewardPerSec.dismiss()
    }
  }, [rewardPerSec.status, onSetPoolStatus, rewardPerSec])

  useEffect(() => {
    if (isPoolWithRewards) {
      const dailyRewardAmountWithFixedDecimals = getDailyRewardsPerSecond(pool.rewards[0].rewardPerSec)

      form.setFieldValue('dailyReward', dailyRewardAmountWithFixedDecimals)
      handleSetFooterText(dailyRewardAmountWithFixedDecimals, 0)
    }
  }, [pool, form, handleSetFooterText, isPoolWithRewards, getDailyRewardsPerSecond])

  useEffect(() => {
    if (dailyRewardFieldValue) {
      if (totalRewardsFieldValue) {
        const days = new BigNumber(totalRewardsFieldValue).dividedBy(dailyRewardFieldValue).toNumber()
        handleSetFooterText(dailyRewardFieldValue, days)
        return
      }

      handleSetFooterText(dailyRewardFieldValue, 0)
    }
  }, [handleSetFooterText, dailyRewardFieldValue, totalRewardsFieldValue])

  return (
    <Form.Item shouldUpdate={(prev, next) => prev !== next} noStyle>
      {({ getFieldValue, setFieldValue }) => (
        <Form.Item
          label='Tokens per Day'
          name='dailyReward'
          rules={[{ required: true, message: 'Please input your daily rewards!' }]}
          tooltip='Total amount of your daily rewards'
        >
          <Input.Group compact size='default' style={{ display: 'flex' }}>
            <Input
              value={getFieldValue('dailyReward')}
              defaultValue={0}
              disabled={
                poolStatus === PoolStatus.COLLECTION_ADDRESS_PENDING ||
                poolStatus === PoolStatus.REWARD_ADDRESS_PENDING ||
                rewardPerSec.isLoading
              }
              onChange={e => setFieldValue('dailyReward', e.target.value)}
              type='number'
              min={0}
            />
            <Button
              type='primary'
              style={{ height: 'auto' }}
              disabled={
                poolStatus === PoolStatus.COLLECTION_ADDRESS_PENDING ||
                poolStatus === PoolStatus.REWARD_ADDRESS_PENDING ||
                rewardPerSec.isLoading
              }
              onClick={() => onUpdateRewardPerSec(getFieldValue('dailyReward') as string)}
              loading={rewardPerSec.isLoading}
            >
              Update
            </Button>
          </Input.Group>
        </Form.Item>
      )}
    </Form.Item>
  )
}
