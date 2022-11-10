import { LinkOutlined } from '@ant-design/icons'
import { List, Typography } from 'antd'
import { chainConfig } from '../../../../ChainConfig'
import { formatShortAccountName, formatToLocaleString } from '../../../../services/UtilService'
import { TokenImage } from '../../../shared/TokenImage'

interface ParticipantProps {
  chainId: number
  buyer: string
  amount: string
}

export default function Participant({ chainId, buyer, amount }: ParticipantProps) {
  const config = chainConfig(chainId)
  const { Text } = Typography

  return (
    <List.Item
      actions={[
        <>
          <Text strong>{`${formatToLocaleString(amount, 4) || '0'} ${config.nativeToken.symbol}`}</Text>
          <a key='list-loadmore-edit' href={`${config.blockExplorer}/address/${buyer}`} target='_blank' rel='noreferrer'>
            <LinkOutlined style={{ fontSize: '14px', marginLeft: '4px' }} />
          </a>
        </>
      ]}
    >
      <List.Item.Meta
        avatar={<TokenImage address={buyer} diameter={30} src='' />}
        title={formatShortAccountName(buyer)}
        style={{ alignItems: 'center' }}
      />
    </List.Item>
  )
}
