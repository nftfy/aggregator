import { TokenImage } from '@components/shared/TokenImage'
import { Col, ColProps, Space, Typography } from 'antd'
import styled from 'styled-components'
import { ChainConfig } from '../../../types/config/ChainConfig'

type Token = {
  id?: string
  name?: string
  symbol?: string
  address: string
}

interface CardTokenImageProps extends ColProps {
  token: Token
  chainConfig: ChainConfig
  image?: string
  native?: boolean
  loading?: boolean
}

const { Text } = Typography

export function CardTokenImage({ token, chainConfig, image, native, loading, ...colProps }: CardTokenImageProps) {
  const tokenId = native === false && !!token?.id && token.id !== token.address ? `#${token.id}` : ''

  const nonNativeName = [token?.name || token?.symbol, tokenId].join(' ')

  return (
    <Col {...colProps}>
      <Link
        href={`${chainConfig.scanAddress}/address/${native ? chainConfig.nativeToken.address : token.address}`}
        target='_blank'
        rel='noreferrer'
      >
        <Space align='center'>
          <TokenImage diameter={40} address={token.address} src={image} loading={loading} />
          <Text strong>{native ? chainConfig.name : nonNativeName}</Text>
        </Space>
      </Link>
    </Col>
  )
}

export default CardTokenImage

const { Link } = {
  Link: styled.a`
    display: flex;
  `
}
