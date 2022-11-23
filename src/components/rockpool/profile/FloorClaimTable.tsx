import Link from 'next/link'
import styled from 'styled-components'
import LoadingIcon from '../../../../components/LoadingIcon'
import { useListClaimsFloorCollections } from '../../../hook/rockpool/buyFloor/useListClaimsFloorCollections'
import { formatTimestamp, formatToLocaleString } from '../../../services/UtilService'
import ClaimFractionsFloorModal from '../../shared/rockpool/ClaimFractionsFloorModal'
import CollectionImage from '../../shared/rockpool/CollectionImage'
import RockpoolTableEmpty from '../../shared/rockpool/RockpoolTableEmpty'
export interface FloorClaimTableProps {
  chainId: number
  walletAddress: string
}

export default function FloorClaimTable({ chainId, walletAddress }: FloorClaimTableProps) {
  const { listClaimsFloorCollections, loading, refetch } = useListClaimsFloorCollections(chainId, walletAddress)

  const headings = [
    { name: 'Collection', align: 'left' },
    { name: 'Round Nº', align: 'center' },
    { name: 'Acquired Date', align: 'center' },
    { name: 'On sale for', align: 'center' },
    { name: 'Participants', align: 'center' },
    { name: 'My participation', align: 'center' },
    { name: 'Action', align: 'center' }
  ]

  if (loading) {
    return (
      <div className='my-20 flex justify-center'>
        <LoadingIcon />
      </div>
    )
  }

  if (!listClaimsFloorCollections.length) {
    return <RockpoolTableEmpty chainId={chainId} type='specific' />
  }

  return (
    <table className='w-full'>
      <thead>
        <tr>
          {headings.map((item, i) => (
            <th key={i} className={`px-6 py-3  text-${item.align} text-sm font-medium text-neutral-600 dark:text-white`}>
              {item.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {listClaimsFloorCollections.length &&
          listClaimsFloorCollections.map(pool => (
            <tr key={pool.poolId} className='h-24 border-b border-gray-300 dark:border-[#525252]'>
              <td className='px-6 py-4'>
                <Link href={`/rockpool/floor/${pool.collectionAddress}`} passHref>
                  <a className='mr-2.5 flex items-center'>
                    <CollectionImage collectionAddress={pool.collectionAddress} collectionName={pool.collectionName} />
                    <div className='ml-2 grid truncate'>
                      <div className='reservoir-h6 dark:text-white'>{pool.collectionName}</div>
                    </div>
                  </a>
                </Link>
              </td>
              <td className='px-6 py-4'>
                <Container>
                  <span className='mr-2.5 ml-2.5  font-light'>{pool.roundNumber}</span>
                </Container>
              </td>
              <td className=' px-6 py-4'>
                <Container>
                  <span className='ml-2.5 mr-2.5  font-light'>{formatTimestamp(pool.timestamp)}</span>
                </Container>
              </td>
              <td className='px-6 py-4'>
                <Container>
                  <span className='mr-2.5 ml-2.5  font-light'>{formatToLocaleString(pool.reservePriceAfterFractionalize)} ETH</span>
                </Container>
              </td>
              <td className=' px-6 py-4'>
                <Container>
                  <span className='ml-2.5 mr-2.5  font-light'>{pool.buyersCount}</span>
                </Container>
              </td>
              <td className=' px-6 py-4'>
                <Container>
                  <span className='ml-2.5 mr-2.5  font-light'>
                    {pool.amount === '0' ? '-' : `${formatToLocaleString(pool.amount)} ETH`}
                  </span>
                </Container>
              </td>
              <td className='px-6 py-4'>
                <Container>
                  <ClaimFractionsFloorModal
                    chainId={chainId}
                    data={{
                      collectionName: pool.collectionName,
                      fractions: pool.fractions,
                      poolId: pool.poolId,
                      amount: pool.amount,
                      fractionsCount: pool.fractionsCount
                    }}
                    walletAccount={walletAddress}
                    refetch={refetch}
                  />
                </Container>
              </td>
            </tr>
          ))}
        <tr></tr>
      </tbody>
    </table>
  )
}

const { Container } = {
  Container: styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
  `
}
