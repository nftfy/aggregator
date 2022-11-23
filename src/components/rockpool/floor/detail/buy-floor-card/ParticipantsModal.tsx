import { makeVar, useReactiveVar } from '@apollo/client'
import { List, Modal } from 'antd'
import styled from 'styled-components'
import { Buyer } from '../../../../../graphql/nftfy/rockpool/SpecificPoolItemBuyer'
import Participant from '../../../detail/Participants/Participant'

interface ParticipantsModalProps {
  buyers: Buyer[]
  chainId: number
}

export const modalParticipantsVar = makeVar(false)

export function ParticipantsModal({ buyers, chainId }: ParticipantsModalProps) {
  const modalParticipants = useReactiveVar(modalParticipantsVar)
  const handleCancel = () => {
    modalParticipantsVar(false)
  }
  return (
    <Modal title='Pool Participants' footer='' open={modalParticipants} onOk={handleCancel} onCancel={handleCancel} destroyOnClose>
      <Content>
        <List bordered dataSource={buyers} renderItem={item => <Participant amount={item.amount} chainId={chainId} buyer={item.buyer} />} />
      </Content>
    </Modal>
  )
}

const { Content } = {
  Content: styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 21px;
  `
}
