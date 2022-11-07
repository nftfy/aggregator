import { PoolStatus, RewardPool } from '@appTypes/pool/RewardPool'
import { Web3Provider } from '@ethersproject/providers'
import { useRewardPoolErc721Factory } from '@hook/contracts/reward-pool-erc721/useRewardPoolErc721Factory'
import { useErc721IsValidContract } from '@hook/erc721/useErc721IsValidContract'
import { Button, Form, FormInstance, Input, message } from 'antd'
import debounce from 'lodash.debounce'
import { useEffect, useRef, useState } from 'react'

enum FieldStatus {
  default = '',
  success = 'success',
  error = 'error'
}

interface PoolFormCollectionFieldProps {
  form: FormInstance
  pool?: RewardPool
  signerProvider: Web3Provider
  chainId: number
  poolStatus: PoolStatus
  onSetPoolStatus: (status: PoolStatus) => void
  onPaste: (fieldName: string) => Promise<void>
  onGetPool: (address: string) => Promise<void>
}

export function PoolFormCollectionField({
  chainId,
  signerProvider,
  poolStatus,
  onSetPoolStatus,
  onPaste,
  onGetPool,
  form,
  pool
}: PoolFormCollectionFieldProps) {
  const { current: fieldName } = useRef('collectionAddress')

  const [poolAddress, setPoolAddress] = useState<string>('')
  const [fieldStatus, setFieldStatus] = useState(FieldStatus.default)

  const factory = useRewardPoolErc721Factory(chainId, signerProvider)
  const { getIsValidContract, loading: isValidating } = useErc721IsValidContract()

  const onCreatePool = (collectionAddress: string) => {
    factory.createPool(collectionAddress).then(setPoolAddress)
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
    if (factory.status === 'success') {
      message.success('Pool has successfully created')
      onSetPoolStatus(PoolStatus.REWARD_ADDRESS_PENDING)
      onGetPool(poolAddress)
      factory.dismiss()
    }
  }, [factory.status, poolAddress, onSetPoolStatus, onGetPool, factory])

  useEffect(() => {
    if (pool?.token) {
      form.setFieldValue(fieldName, pool.token.id)
    }
  }, [pool, fieldName, form])

  return (
    <Form.Item shouldUpdate={(prev, next) => prev !== next} noStyle>
      {({ getFieldValue }) => (
        <Form.Item
          label='Collection Address'
          name={fieldName}
          tooltip='Token address of your collection'
          help={fieldStatus === FieldStatus.error && 'Invalid contract address'}
          validateStatus={fieldStatus}
        >
          <Input.Group compact size='default' style={{ display: 'flex' }}>
            <Input
              value={getFieldValue(fieldName)}
              disabled={poolStatus !== PoolStatus.COLLECTION_ADDRESS_PENDING || factory.isLoading || isValidating}
              onChange={e => onInputChange(e.target.value)}
              suffix={
                poolStatus === PoolStatus.COLLECTION_ADDRESS_PENDING && (
                  <Button onClick={onInputPaste} type='text' size='small' disabled={factory.isLoading || isValidating}>
                    Paste
                  </Button>
                )
              }
            />
            {poolStatus === PoolStatus.COLLECTION_ADDRESS_PENDING && (
              <Button
                type='primary'
                style={{ height: 'auto' }}
                loading={factory.isLoading || isValidating}
                disabled={
                  !getFieldValue(fieldName) ||
                  isValidating ||
                  factory.isLoading ||
                  fieldStatus === FieldStatus.default ||
                  fieldStatus === FieldStatus.error
                }
                onClick={() => onCreatePool(getFieldValue(fieldName) as string)}
              >
                Create
              </Button>
            )}
          </Input.Group>
        </Form.Item>
      )}
    </Form.Item>
  )
}
