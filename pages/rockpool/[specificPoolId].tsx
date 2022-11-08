import { GetServerSideProps } from 'next'
import { Toaster } from 'react-hot-toast'
import Navbar from '../../components/Navbar'
import NetworkWarning from '../../components/NetworkWarning'
import SpecificDetailPage from '../../src/components/rockpool/detail/SpecificDetailPage'

interface FloorDetailProps {
  // chainId: number
  // network: string
  specificPoolId: string
}

export default function FloorDetailPage({ specificPoolId }: FloorDetailProps) {
  return (
    <>
      <Toaster
        position={'top-right'}
        containerStyle={{ zIndex: 100000000000 }}
      />
      <NetworkWarning />
      <main style={{ minWidth: '100vw'}}>
        <Navbar  />
        <SpecificDetailPage chainId={5} specificPoolId={specificPoolId} />
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = ctx => {
  const { network, specificPoolId } = ctx.query
  // const networkName = String(network)

  return Promise.resolve({
    props: {
      // network: networkName,
      specificPoolId: String(specificPoolId)
    }
  })
}
