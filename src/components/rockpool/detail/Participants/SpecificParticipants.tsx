import { UserOutlined } from '@ant-design/icons'
import { Button, Empty, List, Typography } from 'antd'
import styled from 'styled-components'
import { SpecificItemBuyers } from '../../../../graphql/nftfy/rockpool/SpecificItemBuyersQuery'
import InviteCard from './InviteCard'
import Participant from './Participant'
import { modalSpecificParticipantsVar, SpecificParticipantsModal } from './SpecificParticipantsModal'

interface ParticipantsProps {
  chainId: number
  buyersLoading?: boolean
  buyers: SpecificItemBuyers[]
  buyersTotal: number
  poolProgress: number
  walletAddress: string
}

export default function SpecificParticipants({
  buyersTotal,
  chainId,
  buyers,
  buyersLoading,
  poolProgress,
  walletAddress
}: ParticipantsProps) {
  const { Text } = Typography

  return (
    <Content>
      {buyers.length >= 3 && (
        <TitleParticipants>
          <UserOutlined style={{ fontSize: '18px' }} />
          <Text> {`${buyersTotal} Participants`}</Text>
          <Button type='primary' ghost shape='round' size='small' onClick={() => modalSpecificParticipantsVar(true)}>
            See all
          </Button>
        </TitleParticipants>
      )}
      {buyers?.length ? (
        <List
          bordered
          dataSource={buyers.slice(0, 3)}
          loading={buyersLoading}
          renderItem={item => <Participant amount={item.amount} chainId={chainId} buyer={item.buyer} />}
        />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          imageStyle={{
            height: 100
          }}
          description='There are no participants in this pool yet'
        />
      )}
      {buyers?.length === 1 && poolProgress < 100 && <InviteCard owner={buyers[0].buyer.toLowerCase() === walletAddress.toLowerCase()} />}
      <SpecificParticipantsModal chainId={chainId} buyers={buyers} />
    </Content>
  )
}

const { Content, TitleParticipants } = {
  Content: styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 21px;
  `,
  TitleParticipants: styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  `
}
