import { Button, Progress } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import LoadingIcon from '../../../components/LoadingIcon'
import { chainConfig } from '../../ChainConfig'
import { useListBuyFloorCollections } from '../../hook/rockpool/buyFloor/useFloorPublicByAddress'
import { formatToLocaleString } from '../../services/UtilService'
import RockpoolTableEmpty from '../shared/rockpool/RockpoolTableEmpty'

export interface SpecificPublicTableProps {
  chainId: number
  collectionAddress: string
  collectionImage: string
}

export default function OverviewFloorTable({ chainId, collectionAddress, collectionImage }: SpecificPublicTableProps) {
  const { nativeToken } = chainConfig(chainId)
  const { listBuyFloorCollections, loading } = useListBuyFloorCollections(
    chainId,
    nativeToken.address,
    collectionAddress.toLocaleLowerCase()
  )
  const floorCollectionItem = listBuyFloorCollections[0]
  const headings = [
    { name: 'Collection', align: 'left' },
    { name: 'Target price', align: 'left' },
    { name: 'Participants', align: 'left' },
    { name: 'Progress', align: 'left' },
    { name: 'To complete', align: 'left' },
    { name: '', align: 'left' }
  ]

  if (loading) {
    return (
      <div className='my-20 flex justify-center'>
        <LoadingIcon />
      </div>
    )
  }

  if (!floorCollectionItem) return <RockpoolTableEmpty chainId={chainId} type='buyFloor' />

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
        {floorCollectionItem && (
          <tr key={1} className='h-24 border-b border-gray-300 dark:border-[#525252]'>
            <td className='px-6 py-4'>
              <Link href={`/rockpool/floor/${floorCollectionItem.collectionAddress}`} passHref>
                <a className='mr-2.5 flex items-center'>
                  <Image
                    className='rounded object-cover'
                    loader={({ src }) => src}
                    src={collectionImage}
                    alt={`${floorCollectionItem.collectionName} Token Image`}
                    width={48}
                    height={48}
                  />
                  <div className='ml-2 grid truncate'>
                    <div className='reservoir-h6 dark:text-white'>{floorCollectionItem.collectionName}</div>
                  </div>
                </a>
              </Link>
            </td>
            <td className='px-6 py-4'>
              <Container>
                <span className='mr-2.5 ml-2.5  font-light'>{formatToLocaleString(floorCollectionItem.targetPrice)} ETH</span>
              </Container>
            </td>
            <td className=' px-6 py-4'>
              <Container>
                <span className='ml-2.5 mr-2.5  font-light'>{Number(floorCollectionItem.buyersCount)}</span>
              </Container>
            </td>
            <td className='px-6 py-4'>
              <Progress percent={Number(formatToLocaleString(floorCollectionItem.progress, 2))} size='default' />
            </td>
            <td className=' px-6 py-4'>
              <Container>
                <span className='ml-2.5 mr-2.5  font-light'>
                  {formatToLocaleString(Number(floorCollectionItem.targetPrice) - Number(floorCollectionItem.remainingAmount))} ETH
                </span>
              </Container>
            </td>
            <td>
              <ContainerRight>
                <Link href={['rockpool', 'floor', floorCollectionItem.collectionAddress].join('/')} passHref>
                  <Button type='primary' block style={{ width: 148 }}>
                    Enter pool
                  </Button>
                </Link>
              </ContainerRight>
            </td>
          </tr>
        )}
        <tr></tr>
      </tbody>
    </table>
  )
}

const { Container, ContainerRight } = {
  Container: styled.div`
    width: 100%;
    display: flex;
    justify-content: left;
  `,
  ContainerRight: styled.div`
    width: 100%;
    display: flex;
    justify-content: right;
  `
}
