import { PoolStatus, RewardPool } from '@appTypes/pool/RewardPool'
import { Web3Provider } from '@ethersproject/providers'
import { useRewardPoolErc721AddReward } from '@hook/contracts/reward-pool-erc721/useRewardPoolErc721AddReward'
import { useErc20IsValidContract } from '@hook/erc20/useErc20IsValidContract'
import { Button, Form, FormInstance, Input, message } from 'antd'
import debounce from 'lodash.debounce'
import { useEffect, useRef, useState } from 'react'

enum FieldStatus {
  default = '',
  success = 'success',
  error = 'error'
}

interface PoolFormRewardsFieldProps {
  signerProvider: Web3Provider
  chainId: number
  poolStatus: PoolStatus
  pool?: RewardPool
  form: FormInstance
  onSetPoolStatus: (status: PoolStatus) => void
  onPaste: (fieldName: string) => Promise<void>
  onGetPool: (address: string) => Promise<void>
}
export function PoolFormRewardsField({
  pool,
  chainId,
  signerProvider,
  poolStatus,
  onPaste,
  onSetPoolStatus,
  onGetPool,
  form
}: PoolFormRewardsFieldProps) {
  const { current: fieldName } = useRef('rewardAddress')
  const [fieldStatus, setFieldStatus] = useState(FieldStatus.default)

  const reward = useRewardPoolErc721AddReward(chainId, signerProvider)
  const { getIsValidContract, loading: isValidating } = useErc20IsValidContract()

  const onAddRewardToken = (rewardTokenAddress: string) => {
    if (!pool?.address) {
      return
    }

    reward.addRewardToken(pool.address, rewardTokenAddress)
  }

  const handleValidateField = debounce(async (address: string) => {
    const isValid = await getIsValidContract(chainId, address)
    setFieldStatus(isValid ? FieldStatus.success : FieldStatus.error)
  }, 500)

  const onInputChange = (value: string) => {
    form.setFieldValue(fieldName, value)
    handleValidateField(value)
  }

  const onInputPaste = async () => {
    await onPaste(fieldName)
    handleValidateField(form.getFieldValue(fieldName) as string)
  }

  useEffect(() => {
    if (reward.status === 'success') {
      message.success('Reward token has successfully updated')
      onSetPoolStatus(PoolStatus.DAILY_REWARD_PENDING)

      if (pool?.address) {
        onGetPool(pool.address)
      }

      reward.dismiss()
    }
  }, [reward.status, onSetPoolStatus, reward, onGetPool, pool?.address])

  useEffect(() => {
    if (pool?.rewards.length) {
      form.setFieldValue(fieldName, pool.rewards[0].token.id)
    }
  }, [pool, fieldName, form])

  return (
    <Form.Item shouldUpdate={(prev, next) => prev !== next} noStyle>
      {({ getFieldValue }) => (
        <Form.Item
          label='Reward Address'
          name={fieldName}
          rules={[{ required: true, message: 'Please input your reward address!' }]}
          tooltip='Token address of your rewards'
          help={fieldStatus === FieldStatus.error && 'Invalid contract address'}
          validateStatus={fieldStatus}
        >
          <Input.Group compact size='default' style={{ display: 'flex' }}>
            <Input
              value={getFieldValue(fieldName)}
              disabled={poolStatus !== PoolStatus.REWARD_ADDRESS_PENDING || reward.isLoading || isValidating}
              onChange={e => onInputChange(e.target.value)}
              suffix={
                poolStatus === PoolStatus.REWARD_ADDRESS_PENDING && (
                  <Button onClick={onInputPaste} type='text' size='small' disabled={reward.isLoading || isValidating}>
                    Paste
                  </Button>
                )
              }
            />
            {(poolStatus === PoolStatus.COLLECTION_ADDRESS_PENDING || poolStatus === PoolStatus.REWARD_ADDRESS_PENDING) && (
              <Button
                type='primary'
                style={{ height: 'auto' }}
                loading={reward.isLoading || isValidating}
                disabled={
                  !getFieldValue(fieldName) ||
                  isValidating ||
                  reward.isLoading ||
                  fieldStatus === FieldStatus.default ||
                  fieldStatus === FieldStatus.error
                }
                onClick={() => onAddRewardToken(getFieldValue(fieldName) as string)}
              >
                Update
              </Button>
            )}
          </Input.Group>
        </Form.Item>
      )}
    </Form.Item>
  )
}
