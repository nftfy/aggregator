import React, { ReactNode } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import styled from 'styled-components'

export interface CardGridProps {
  data: React.ReactNode[]
  loadMore: () => void
  hasMore: boolean
  loader: ReactNode
}

export default function CardGrid({ data, loadMore, hasMore, loader }: CardGridProps) {
  return (
    <InfiniteScroll next={loadMore} hasMore={hasMore} loader={loader} dataLength={data.length} style={{ overflow: 'unset' }}>
      <Grid>{data}</Grid>
    </InfiniteScroll>
  )
}
const { Grid } = {
  Grid: styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    grid-gap: 24px;

    max-width: 100%;
    &::-webkit-scrollbar {
      width: 0px;
    }
  `
}
