import { Button, Progress } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import LoadingIcon from '../../../components/LoadingIcon'
import { useSpecificPublicItems } from '../../hook/rockpool/specific/useSpecificPulicItems'
import { OrderDirection, SpecificPoolItemFilter, SpecificPoolItemOrderBy } from '../../models/rockpool/SpecificPoolsTypes'
import { formatToLocaleString } from '../../services/UtilService'
import RockpoolTableEmpty from '../shared/rockpool/RockpoolTableEmpty'

export interface OverviewFloorTableProps {
  chainId: number
  collectionAddress: string
}

export default function OverviewSpecificTable({ chainId, collectionAddress }: OverviewFloorTableProps) {
  const { specificPools, loading } = useSpecificPublicItems(
    chainId,
    {
      type: SpecificPoolItemFilter.live,
      sortingDirection: OrderDirection.desc,
      sortingField: SpecificPoolItemOrderBy.timestamp
    },
    collectionAddress,
    5
  )
  const history = useRouter()

  const headings = [
    { name: 'NFT', align: 'left' },
    { name: 'Target price', align: 'center' },
    { name: 'Participants', align: 'center' },
    { name: 'Progress', align: 'center' },
    { name: 'To complete', align: 'center' },
    { name: '', align: 'center' }
  ]

  if (loading) {
    return (
      <div className='my-20 flex justify-center'>
        <LoadingIcon />
      </div>
    )
  }

  if (!specificPools?.length) return <RockpoolTableEmpty chainId={chainId} type='specific' />

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
        {!!specificPools.length &&
          specificPools.map(pool => (
            <tr key={pool.id} className='h-24 border-b border-gray-300 dark:border-[#525252]'>
              <td className='px-6 py-4'>
                <Link href={`/rockpool/specific/${pool.id}`} passHref>
                  <a className='mr-2.5 flex items-center'>
                    <Image
                      className='rounded object-cover'
                      loader={({ src }) => src}
                      src={pool.target.metadata.image}
                      alt={`${pool.target.metadata.name} Token Image`}
                      width={48}
                      height={48}
                    />
                    <div className='ml-2 grid truncate'>
                      <div className='reservoir-h6 dark:text-white'>{pool.target.metadata.name}</div>
                    </div>
                  </a>
                </Link>
              </td>
              <td className='px-6 py-4'>
                <Container>
                  <span className='mr-2.5 ml-2.5  font-light'>{formatToLocaleString(pool.targetPrice)} ETH</span>
                </Container>
              </td>
              <td className=' px-6 py-4'>
                <Container>
                  <span className='ml-2.5 mr-2.5  font-light'>{Number(pool.buyersCount)}</span>
                </Container>
              </td>
              <td className='px-6 py-4'>
                <Progress percent={Number(pool.poolProgress)} size='default' />
              </td>
              <td className=' px-6 py-4'>
                <Container>
                  <span className='ml-2.5 mr-2.5  font-light'>
                    {formatToLocaleString(Number(pool.targetPrice) - Number(pool.amount))} ETH
                  </span>
                </Container>
              </td>
              <td>
                <ContainerRight>
                  <Button type='primary' block onClick={() => history.push(`/rockpool/specific/${pool.id}`)} style={{ width: 148 }}>
                    Enter pool
                  </Button>
                </ContainerRight>
              </td>
            </tr>
          ))}
        <tr></tr>
      </tbody>
    </table>
  )
}

const { Container, ContainerRight } = {
  Container: styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
  `,
  ContainerRight: styled.div`
    width: 100%;
    display: flex;
    justify-content: right;
  `
}
