import { GetServerSideProps } from 'next'
import SpecificDetailPage from '../../../src/components/rockpool/detail/SpecificDetailPage'
import { DefaultPageTemplate } from '../../../src/components/shared/DefaultPageTemplate'

interface FloorDetailProps {
  specificPoolId: string
}

export default function FloorDetailPage({ specificPoolId }: FloorDetailProps) {
  const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
  
  return (

      <DefaultPageTemplate title='Specific' product='Rockpool'>
        <SpecificDetailPage chainId={Number(CHAIN_ID) || 1} specificPoolId={specificPoolId} />
      </DefaultPageTemplate>
 
  )
}

export const getServerSideProps: GetServerSideProps = ctx => {
  const { specificPoolId } = ctx.query

  return Promise.resolve({
    props: {
      specificPoolId: String(specificPoolId)
    }
  })
}
