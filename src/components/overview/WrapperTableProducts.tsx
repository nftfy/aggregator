import { Button, PageHeader } from 'antd'
import { ReactNode } from 'react-markdown/lib/react-markdown'
import styled from 'styled-components'

export interface WrapperTableProductsProps {
  title: string
  buttonAffter?: ReactNode
  children: ReactNode
  seeAllAction: () => void
}

export default function WrapperTableProducts({ title, children, buttonAffter, seeAllAction }: WrapperTableProductsProps) {
  return (
    <Container>
      <PageHeader
        title={title}
        extra={
          <ExtraContainer>
            {buttonAffter && buttonAffter}
            <Button block ghost type='primary' shape='default' style={{ width: 85 }} onClick={() => seeAllAction()}>
              See all
            </Button>
          </ExtraContainer>
        }
      />
      <div>{children}</div>
    </Container>
  )
}

const { Container, ExtraContainer } = {
  Container: styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
  `,
  ExtraContainer: styled.div`
    display: flex;
    gap: 8px;
    button {
      max-height: 32px !important;
      height: 32px !important;
    }
  `
}
