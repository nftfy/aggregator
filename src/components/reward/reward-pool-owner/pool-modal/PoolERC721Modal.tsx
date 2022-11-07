import { PoolStatus, RewardPool } from '@appTypes/pool/RewardPool'
import { Web3Provider } from '@ethersproject/providers'
import { readText } from '@services/NavigatorService'
import { Col, Form, Row } from 'antd'
import { PoolFormCollectionField } from '../pool-form/PoolFormCollectionField'
import { PoolFormDailyRewards } from '../pool-form/PoolFormDailyRewards'
import { PoolFormRewardsField } from '../pool-form/PoolFormRewardsField'
import { PoolFormTotalRewards } from '../pool-form/PoolFormTotalRewards'

type FormFields = { collectionAddress: string; rewardAddress: string; dailyReward: string; totalRewards: string }

interface PoolERC721ModalProps {
  signerProvider: Web3Provider
  walletAccount: string
  chainId: number
  pool?: RewardPool
  poolStatus: PoolStatus
  onSetPoolStatus: (status: PoolStatus) => void
  onSetFooterText: (text: string) => void
  onGetPool: (address: string) => Promise<void>
}
export function PoolERC721Modal({
  pool,
  chainId,
  signerProvider,
  walletAccount,
  poolStatus,
  onSetPoolStatus,
  onSetFooterText,
  onGetPool
}: PoolERC721ModalProps) {
  const [form] = Form.useForm<FormFields>()

  const onPaste = async (key: string) => {
    form.setFieldValue(key, await readText())
  }

  return (
    <Form name='erc721' autoComplete='off' form={form} labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <PoolFormCollectionField
            pool={pool}
            form={form}
            onGetPool={onGetPool}
            signerProvider={signerProvider}
            chainId={chainId}
            poolStatus={poolStatus}
            onSetPoolStatus={onSetPoolStatus}
            onPaste={onPaste}
          />
        </Col>
        <Col span={24}>
          <PoolFormRewardsField
            pool={pool}
            form={form}
            onGetPool={onGetPool}
            signerProvider={signerProvider}
            chainId={chainId}
            poolStatus={poolStatus}
            onSetPoolStatus={onSetPoolStatus}
            onPaste={onPaste}
          />
        </Col>
        <Col span={24}>
          <PoolFormDailyRewards
            form={form}
            signerProvider={signerProvider}
            chainId={chainId}
            poolStatus={poolStatus}
            onSetPoolStatus={onSetPoolStatus}
            onSetFooterText={onSetFooterText}
            pool={pool}
          />
        </Col>
        <Col span={24}>
          <PoolFormTotalRewards
            walletAccount={walletAccount}
            form={form}
            signerProvider={signerProvider}
            chainId={chainId}
            poolStatus={poolStatus}
            pool={pool}
            onSetFooterText={onSetFooterText}
          />
        </Col>
      </Row>
    </Form>
  )
}
