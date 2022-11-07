import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import styled from 'styled-components'

export default function CardLoader() {
  const antIcon = <LoadingOutlined style={{ fontSize: 32 }} spin />

  return (
    <Container>
      <Spin indicator={antIcon} />
    </Container>
  )
}

const { Container } = {
  Container: styled.div`
    display: grid;
    grid-template-columns: 1fr;
    align-items: center;
    justify-items: center;

    height: 20vh;
  `
}
