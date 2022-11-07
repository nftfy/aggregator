import { RowProps } from 'antd'
import { chainConfig as configByChain } from '../../../ChainConfig'
import { CardTokenBalance } from './CardTokenBalance'
import { CardTokenContainer } from './CardTokenContainer'
import { CardTokenImage } from './CardTokenImage'

export type Token = {
  id?: string
  name?: string
  symbol?: string
  address: string
}

interface CardTokenProps extends RowProps {
  title: string
  token: Token
  chainId: number
  image?: string
  native?: boolean
  amount?: string
  loading?: boolean
  showBalanceSymbol?: boolean
}

export function CardToken({
  token,
  chainId,
  image,
  amount = '0',
  title,
  native = false,
  showBalanceSymbol = true,
  loading,
  ...containerProps
}: CardTokenProps) {
  const chainConfig = configByChain(chainId)

  return (
    <CardTokenContainer {...containerProps}>
      <CardTokenImage token={token} chainConfig={chainConfig} image={image} native={native} loading={loading} />
      <CardTokenBalance
        title={title}
        token={token}
        chainConfig={chainConfig}
        native={native}
        amount={amount}
        showBalanceSymbol={showBalanceSymbol}
      />
    </CardTokenContainer>
  )
}

export default CardToken
