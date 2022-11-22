import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import LoadingIcon from '../../../../components/LoadingIcon'
import { useClaimableFractions } from '../../../hook/rockpool/specific/useClaimableFractions'
import { formatTimestamp, formatToLocaleString } from '../../../services/UtilService'
import ClaimFractionsSpecificModal from '../../shared/rockpool/ClaimFractionsSpecificModal'
import { imageFailedFallback } from '../../shared/rockpool/CollectionImageFallBack'
import RockpoolTableEmpty from '../../shared/rockpool/RockpoolTableEmpty'
export interface SpecificClaimTableProps {
  chainId: number
  walletAddress: string
}

export default function SpecificClaimTable({ chainId, walletAddress }: SpecificClaimTableProps) {
  const { claimableFractions, loading, refetch } = useClaimableFractions(chainId, walletAddress)

  const headings = [
    { name: 'NFT', align: 'left' },
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

  if (!claimableFractions?.length) return <RockpoolTableEmpty chainId={chainId} type='specific' />

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
        {claimableFractions.length &&
          claimableFractions.map(pool => (
            <tr key={pool.poolId} className='h-24 border-b border-gray-300 dark:border-[#525252]'>
              <td className='px-6 py-4'>
                <Link href={`/rockpool/specific/${pool.poolId}`} passHref>
                  <a className='mr-2.5 flex items-center'>
                    <Image
                      className='rounded object-cover'
                      loader={({ src }) => src}
                      src={pool.imageUrl || imageFailedFallback}
                      alt={`${pool.collectionAddress} Token Image`}
                      width={48}
                      height={48}
                    />
                    <div className='ml-2 grid truncate'>
                      <div className='reservoir-h6 dark:text-white'>{`${pool.collectionName} #${pool.tokenId}`}</div>
                    </div>
                  </a>
                </Link>
              </td>
              <td className=' px-6 py-4'>
                <Container>
                  <span className='ml-2.5 mr-2.5  font-light'>{formatTimestamp(pool.lastSale)}</span>
                </Container>
              </td>
              <td className='px-6 py-4'>
                <Container>
                  <span className='mr-2.5 ml-2.5  font-light'>{formatToLocaleString(pool.targetPrice)} ETH</span>
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
                  <ClaimFractionsSpecificModal
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
