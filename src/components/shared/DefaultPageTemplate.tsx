import { Layout, PageHeader, RowProps } from 'antd'
import Head from 'next/head'
import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import styled from 'styled-components'
import Navbar from '../../../components/Navbar'
import NetworkWarning from '../../../components/NetworkWarning'
import { ModalTransaction } from './TransactionModal'

const { Content } = Layout

export interface PageHeaderProps {
  pageHeaderProps?: RowProps
  pageHeaderAfter: ReactNode
  pageHeaderTitle: ReactNode
  onBack: () => void
}

interface DefaultPageTemplateProps {
  title: string
  product: string
  children: ReactNode
  subHeader?: PageHeaderProps
}

export function DefaultPageTemplate({ title, product, children, subHeader }: DefaultPageTemplateProps) {
  return (
    <>
      {/* TODO Exchange the goals for the aggregator information */}
      <Head>
        <meta property='title' content={`${product} ${title}`} />
        <meta name='description' content='app.rewards.nftfy.org is a decentralized protocol where you can own rewards staking tokens.' />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://app.rewards.nftfy.org/' />
        <meta property='og:title' content='Nftfy - Rockpool' />
        <meta
          property='og:description'
          content='app.rewards.nftfy.org is a decentralized protocol where you can own rewards staking tokens.'
        />
        <meta property='og:image' content='https://nftfy.org/nftfy.jpg' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:url' content='https://nftfy.org/' />
        <meta name='twitter:title' content='Nftfy - Rockpool' />
        <meta
          name='twitter:description'
          content='app.rewards.nftfy.org is a decentralized protocol where you can own rewards staking tokens.'
        />
        <meta name='twitter:image' content='https://nftfy.org/nftfy.jpg' />
      </Head>
      <Layout style={{ minHeight: '100vh', margin: '0 auto' }}>
        <Navbar />
        <Toaster position={'top-right'} containerStyle={{ zIndex: 100000000000 }} />
        <NetworkWarning />
        <Main>
          {subHeader && (
            <PageHeader
              title={subHeader.pageHeaderTitle}
              extra={subHeader.pageHeaderAfter}
              {...subHeader.pageHeaderProps}
              onBack={subHeader.onBack}
            />
          )}
          {children}
        </Main>
        <ModalTransaction />
      </Layout>
    </>
  )
}

const { Main } = {
  Main: styled(Content)`
    padding: 16px 24px;
    max-width: calc(var(--screen-xl) - 48px);
    max-width: 1136px;
    margin: 0 auto;
    width: 100%;
  `
}
