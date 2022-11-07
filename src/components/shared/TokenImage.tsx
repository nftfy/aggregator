import { Skeleton } from 'antd'
import { useEffect, useState } from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import styled, { css } from 'styled-components'

interface Erc721CollectionImageProps {
  src?: string
  address: string
  diameter: number
  shape?: 'circle' | 'square'
  className?: string
  loading?: boolean
}

export function TokenImage({ address, src, className = '', diameter, loading = true, shape = 'circle' }: Erc721CollectionImageProps) {
  const [hasFailed, setHasFailed] = useState(false)
  const [isLoading, setIsLoading] = useState(loading)
  const [loadedSrc, setLoadedSrc] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!src) {
      setHasFailed(true)
      setIsLoading(false)
      return
    }

    const img = new Image()

    img.src = src

    img.onload = () => {
      setHasFailed(false)
      setLoadedSrc(src)
      setIsLoading(false)
    }

    img.onerror = () => {
      setHasFailed(true)
      setIsLoading(false)
    }
  }, [src])
  return (
    <ContainerImg shape={shape} diameter={diameter}>
      {isLoading && <Skeleton.Avatar active size={diameter} />}
      {hasFailed && address && <Jazzicon seed={jsNumberForAddress(address)} diameter={diameter} />}
      {!hasFailed && !isLoading && <Img src={loadedSrc} className={className} diameter={diameter} />}
    </ContainerImg>
  )
}

const { ContainerImg, Img } = {
  ContainerImg: styled.div<{ shape: 'circle' | 'square'; diameter: number }>`
    overflow: hidden;
    display: flex;
    align-items: center;
    height: ${({ diameter }) => diameter}px;
    width: ${({ diameter }) => diameter}px;
    ${({ shape }) =>
      shape === 'circle'
        ? css`
            border-radius: 50%;
            overflow: hidden;
          `
        : css`
            border-radius: var(--border-radius-base);
          `};
  `,
  Img: styled.img<{ diameter: number }>`
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  `
}
