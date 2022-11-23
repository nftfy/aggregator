import { ShareAltOutlined, TwitterOutlined } from '@ant-design/icons'
import ExternalLink from '@components/shared/ExternalLink'
import { chainConfig } from '@config/chain'
import { faCopy } from '@fortawesome/free-regular-svg-icons'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Divider, message, Space, Typography } from 'antd'
import styled from 'styled-components'
import { writeText } from '../../../services/NavigatorService'

const { Text, Link } = Typography

interface RewardPoolSocialInfoProps {
  poolAddress: string
  network: string
  chainId: number
}

export function RewardPoolSocialInfo({ chainId, poolAddress, network }: RewardPoolSocialInfoProps) {
  const url = window?.location?.href
  const config = chainConfig(chainId)

  const handleCopyToClipboard = () => {
    writeText(url).then(() => message.success('URL copied'))
  }

  return (
    <div>
      <Space>
        <Space>
          <Text>
            <ShareAltOutlined title='Shared' /> Shared
          </Text>
          <ExternalLink href={`https://twitter.com/intent/tweet?url=${url}`}>
            <TwitterOutlined />
          </ExternalLink>
        </Space>
        <CopyToBoard onClick={handleCopyToClipboard}>
          <CopyIcon icon={faCopy} />
        </CopyToBoard>
      </Space>
      <Divider type='vertical' />
      <Space>
        <Link href={`${config.scanAddress}address/${poolAddress}`} target='_blank'>
          <Space>
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            <Text>View on EtherScan</Text>
          </Space>
        </Link>
      </Space>
    </div>
  )
}

const { CopyIcon, CopyToBoard } = {
  CopyIcon: styled(FontAwesomeIcon)`
    color: var(--primary-color);
  `,
  CopyToBoard: styled('span')`
    cursor: pointer;
  `
}
