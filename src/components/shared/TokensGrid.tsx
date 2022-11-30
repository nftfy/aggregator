import { Dispatch, FC, SetStateAction } from 'react'

import Masonry from 'react-masonry-css'

import { Token } from 'recoil/cart/atom'
import LoadingCard from '../../../components/LoadingCard'
import TokenCard from '../../../components/TokenCard'
import useTokens from '../../../hooks/useTokens'

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID

type Props = {
  tokens: ReturnType<typeof useTokens>['tokens']
  collectionImage: string | undefined
  setClearCartOpen?: Dispatch<SetStateAction<boolean>>
  setCartToSwap?: Dispatch<SetStateAction<Token[] | undefined>>
}

const TokensGridNftfy: FC<Props> = ({ tokens, collectionImage, setClearCartOpen, setCartToSwap }) => {
  const { data, mutate } = tokens
  if (!CHAIN_ID) return null

  return (
    <>
      <Masonry
        key='tokensGridMasonry'
        breakpointCols={{
          default: 6,
          1900: 5,
          1536: 4,
          1280: 3,
          1024: 2,
          768: 2,
          640: 2,
          500: 1
        }}
        className='masonry-grid'
        columnClassName='masonry-grid_column'
      >
        {!tokens
          ? Array(5)
              .fill(null)
              .map((_, index) => <LoadingCard key={`loading-card-${index}`} />)
          : data?.slice(0, 5).map(token => {
              return (
                <TokenCard
                  token={token}
                  collectionImage={collectionImage}
                  mutate={mutate}
                  key={`${token?.token?.contract}:${token?.token?.tokenId}`}
                />
              )
            })}
      </Masonry>
    </>
  )
}

export default TokensGridNftfy
