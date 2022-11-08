import { makeVar, useReactiveVar } from '@apollo/client'
import { List, Modal } from 'antd'
import styled from 'styled-components'
import { SpecificItemBuyers } from '../../../../graphql/nftfy/rockpool/SpecificItemBuyersQuery'
import Participant from './Participant'

interface ParticipantsModalProps {
  buyers: SpecificItemBuyers[]
  chainId: number
}

export const modalSpecificParticipantsVar = makeVar(false)

export function SpecificParticipantsModal({ buyers, chainId }: ParticipantsModalProps) {
  const modalParticipants = useReactiveVar(modalSpecificParticipantsVar)
  const handleCancel = () => {
    modalSpecificParticipantsVar(false)
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
