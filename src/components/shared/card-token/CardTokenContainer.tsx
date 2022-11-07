import { Grid, Row, RowProps } from 'antd'
import { ReactNode } from 'react'
import styled from 'styled-components'

const { useBreakpoint } = Grid

interface CardTokenContainerContainer extends RowProps {
  children: ReactNode
}

export function CardTokenContainer({ children, ...rowProps }: CardTokenContainerContainer) {
  const screens = useBreakpoint()
  const isSmallDevices = (screens.xs || screens.sm) && !screens.md && !screens.lg

  return (
    <RowContainer align='middle' justify='space-between' gutter={isSmallDevices ? 8 : 0} {...rowProps}>
      {children}
    </RowContainer>
  )
}

export const { RowContainer } = {
  RowContainer: styled(Row)`
    background-color: var(--gray-3);
    border-radius: var(--border-radius-base);
    padding: 0.75rem;
  `
}

export default CardTokenContainer
