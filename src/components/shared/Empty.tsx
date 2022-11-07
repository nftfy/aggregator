import { Empty as AntEmpty } from 'antd'
import styled from 'styled-components'

export function Empty() {
  return (
    <Container>
      <AntEmpty description='No Data' image={AntEmpty.PRESENTED_IMAGE_SIMPLE} />
    </Container>
  )
}

const { Container } = {
  Container: styled.div`
    text-align: center;
  `
}
