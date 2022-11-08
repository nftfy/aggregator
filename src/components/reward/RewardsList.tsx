import styled from 'styled-components'
import tx from 'tailwind-styled-components'
import { RewardPools } from './reward-pools/RewardPools'

export const RewardsList = () => {
  return <RewardPools chainId={5} />
}

const { CardTw, ContentTw } = {
  CardTw: tx.div`
    flex-auto
    h-365
    rounded-2xl
    border
    border-zinc-400
    shadow-sm
    overflow-hidden
  `,
  ContentTw: tx.div`
    flex 
    flex-col
    p-4
    gap-2
  `
}
const { Card, Header, Content, HideContent, Banner } = {
  Card: styled(CardTw)`
    max-width: 276px;
    height: 359px;
  `,
  Header: styled.div<{ hidden: boolean }>`
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    display: block;
    overflow: hidden;
    height: ${props => (props.hidden ? 0 : 155)}px;
    transition: height 0.3s ease-in-out;
  `,
  Banner: styled.img``,
  HideContent: styled.div``,
  Content: styled(ContentTw)``
}
