import React from "react";
import { AiOutlineUser } from "react-icons/ai";
import styled from "styled-components";
import tx from 'tailwind-styled-components';
import { RewardPool } from "../../types/pool/RewardPool";

interface CardRewardProps {
  banner: string,
  collectionImage: string
  pool: RewardPool
}

export const CardReward = ({pool, banner, collectionImage }:CardRewardProps) => {
  const [isShowDetails, setIsShowDetails] = React.useState(false)
  const { offchain, rewards } = pool
  console.log('offchain', offchain?.sponsor?.name)
  return (
    <Card onMouseEnter={()=>setIsShowDetails(!isShowDetails)} onMouseLeave={()=>setIsShowDetails(!isShowDetails)} className=''>
        <Header className='rounded-t-lg' hidden={isShowDetails}>
          <Banner className='rounded-t-2xl  overflow-hidden' src={banner}  />
        </Header>
        <Content className=''>
          <span>Sponsored by:</span>
          <div className='flex flex-row gap-1'>
            <img  className='rounded-full' src={collectionImage} width={24} height={24} />
            <span className='text-sm'>{offchain?.sponsor?.name ?? 'Not defined'}</span>
          </div>
          <div className='flex flex-row gap-2 justify-between'>
            <div>
              <span className='text-sm'>Stake</span>
              <div className='flex flex-row gap-1'>
                <img  className='rounded-full' src={collectionImage} width={24} height={24} />
                <span className='text-sm'>{pool?.token?.symbol ?? pool.token?.name  ?? 'Ethereum'}</span>
              </div>
            </div>
            <div>
              <span className='text-sm'>Earn Fractions</span>
              <div className='flex flex-row gap-1'>
                <img  className='rounded-full' src={collectionImage} width={24} height={24} />
                <span className='text-sm'>{rewards[0].token?.symbol ?? rewards[0].token?.name }</span>
              </div>
            </div>
          </div>
          <button className='w-full px-4 py-4 h-8 btn-primary-fill rounded-lg'> Stake</button>
          <div className='flex flex-row gap-2 justify-between'>
            <div>
              <span>44d : 16h : 15m : 59s</span>
            </div>
            <div className='flex gap-1 justify-center items-center'>
              <AiOutlineUser/>
              <span>{pool.userCount}</span>
            </div>
          </div>
        </Content>
        <HideContent className='flex flex-col p-4 gap-2'>
          <hr />
          <span className='text-sm'>
            My Stake
          </span>
          <div className='flex flex-row gap-2 justify-between'>
            <span className='text-sm'>
              1.76k
            </span>
            <div className='flex flex-row gap-2'>
              <button className='px-1 py-1 h-8 btn-primary-fill rounded-lg' >
                <span className='text-sm'>
                  Add
                </span>
              </button>
              <button className='px-1 py-1 h-8 border-2 rounded-lg'>
                <span className='text-sm'>
                  Stake
                </span>
              </button>
            </div>
          </div>
          <div className='flex flex-row gap-2 justify-between'>
            <div className='flex flex-col'>
              <span className='text-sm'>
                My Rewards
              </span>
              <span className='text-sm'>
                0 NFTFYR
              </span>
            </div>
            <div className='flex flex-row gap-2'>
              <button className='px-1 py-1 h-8 btn-primary-fill rounded-lg' >
                <span className='text-sm'>
                  Harvest
                </span>
              </button>
            </div>
          </div>
        </HideContent>
      </Card>
  )
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
  ContentTw:tx.div`
    flex 
    flex-col
    p-4
    gap-2
  `
}
const {Card, Header, Content, HideContent, Banner} = {
  Card: styled(CardTw)`
    max-width: 276px;
    height: 359px;
    
    
  `,
  Header: styled.div<{hidden:boolean}>`
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    display: block;
    overflow: hidden;
    height: ${props => props.hidden ? 0 : 155}px;
    transition: height .3s ease-in-out;
  `,
  Banner: styled.img``,
  HideContent: styled.div``,
  Content: styled(ContentTw)``
}