import { Button, Typography } from 'antd'
import Image from 'next/image'
import empty from 'public/assets/empty.svg'
import styled from 'styled-components'
import { chainConfig } from '../../../ChainConfig'
export interface RockpoolTableEmptyProps {
  chainId: number
  type: 'buyFloor' | 'specific'
}

export default function RockpoolTableEmpty({ chainId, type }: RockpoolTableEmptyProps) {
  const { Text } = Typography
  const { products } = chainConfig(chainId)
  return (
    <Container>
      <div>
        <Image className='rounded object-cover' loader={({ src }) => src} src={empty} alt={`no data`} />
        <Text type='secondary'>There is no open pool, start a pool for the nft you want!</Text>
        <Button
          style={{ width: 128 }}
          type='primary'
          onClick={() => window.open(products[`${type}`].createPoolUrl, '_blank', 'noopener,noreferrer')}
        >
          Start a pool
        </Button>
      </div>
    </Container>
  )
}

const { Container } = {
  Container: styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 13px;
    }
  `
}
