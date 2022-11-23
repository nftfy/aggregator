import Image from 'next/image'
import styled from 'styled-components'

interface RewardPoolCardCoverProps {
  height?: string
  alt?: string
  src?: string
}

export function CardCover({ alt, src, height = '140px' }: RewardPoolCardCoverProps) {
  return (
    <Container height={height}>
      <Image priority alt={alt} src={src || '/assets/imgs/poolDefault.svg'} layout='fill' objectFit='cover' objectPosition='center' />
    </Container>
  )
}
const { Container } = {
  Container: styled.div<{ height?: string }>`
    position: relative;
    overflow: hidden;
    width: 100%;
    height: ${({ height }) => height};
    transition: height 0.3s;
  `
}

export default CardCover
