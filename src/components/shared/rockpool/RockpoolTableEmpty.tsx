import { Button, Empty as AntEmpty } from 'antd'
import styled from 'styled-components'
import { chainConfig } from '../../../ChainConfig'
export interface RockpoolTableEmptyProps {
  chainId: number
  type: 'buyFloor' | 'specific'
}

export default function RockpoolTableEmpty({ chainId, type }: RockpoolTableEmptyProps) {
  const { products } = chainConfig(chainId)
  return (
    <Container>
      <div>
        <AntEmpty description='There is no open pool, start a pool for the nft you want!' image={AntEmpty.PRESENTED_IMAGE_SIMPLE} />
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

      .ant-empty.ant-empty-normal {
        margin: 0;
      }
    }
  `
}
