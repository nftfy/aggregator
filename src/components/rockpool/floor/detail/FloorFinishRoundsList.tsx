import { Button, Table, Typography } from 'antd'
import type { AlignType, FixedType } from 'rc-table/lib/interface'
import styled from 'styled-components'
import { useAccount } from 'wagmi'
import { chainConfig } from '../../../../ChainConfig'
import { globalConfig } from '../../../../config'
import { useListFloorPoolsCollections } from '../../../../hook/rockpool/buyFloor/useListFloorPoolsCollections'
import { BuyFloorStatus } from '../../../../models/rockpool/floor/BuyFloorStatusEnum'
import { Buyer, ListFloorPoolsCollections } from '../../../../models/rockpool/floor/listBuyFloorCollections'
import { formatTimestamp, formatToLocaleString } from '../../../../services/UtilService'
import ClaimFractionsModal from '../../../shared/rockpool/ClaimFractionsModal'
import { TokenImage } from '../../../shared/TokenImage'

export interface FloorFinishRoundsListProps {
  chainId: number
  collectionAddress: string
}

export default function FloorFinishRoundsList({ chainId, collectionAddress }: FloorFinishRoundsListProps) {
  const account = useAccount()
  const walletAccount = account?.address || ''
  const { nativeToken } = chainConfig(chainId)

  const { listFloorPoolsCollections, refetch, loading, hasMore, loadMore } = useListFloorPoolsCollections(
    chainId,
    collectionAddress.toLowerCase(),
    nativeToken.address,
    BuyFloorStatus.ENDED,
    walletAccount?.toLowerCase()
  )

  const findBuyer = (item: Buyer) => item.buyer.toLowerCase() === walletAccount.toLowerCase() && item.fractionsCount !== '0'

  const columns = [
    {
      title: 'Acquired NFT',
      dataIndex: 'target',
      key: 'target',
      fixed: 'left' as FixedType,
      align: 'left' as AlignType,
      render: (_: unknown, data: ListFloorPoolsCollections) => (
        <Collection>
          <TokenImage diameter={40} src={data.target.metadata.image} address={data.target.collection.id} loading={loading} />
          <span>{`${data.target.collection.name} #${data.target.tokenId}`}</span>
        </Collection>
      )
    },
    {
      title: 'Round Nº',
      dataIndex: 'roundNumber',
      key: 'roundNumber',
      align: 'center' as AlignType
    },
    {
      title: 'Acquired Date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      align: 'right' as AlignType,
      render: (_: unknown, data: ListFloorPoolsCollections) => <span>{formatTimestamp(data.timestamp)}</span>
    },
    {
      title: 'Participants',
      dataIndex: 'buyersCount',
      key: 'buyersCount',
      align: 'center' as AlignType
    },
    {
      title: 'On sale for',
      dataIndex: 'reservePrice',
      align: 'right' as AlignType,
      render: (_: unknown, data: ListFloorPoolsCollections) => (
        <Typography.Text>{formatToLocaleString(data.reservePriceAfterFractionalize)} ETH</Typography.Text>
      ),
      key: 'reservePrice'
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      align: 'center' as AlignType,
      render: (_: unknown, data: ListFloorPoolsCollections) => {
        const buyer = data.buyers.find(findBuyer)
        return (
          <ClaimFractionsModal
            data={{
              poolId: data.id,
              amount: buyer?.amount,
              fractionsCount: buyer?.fractionsCount,
              fractions: data.fractions,
              collectionName: data.target.collection.name
            }}
            walletAccount={walletAccount}
            refetch={refetch}
            chainId={chainId}
          />
        )
      }
    }
  ]
  return (
    <Content>
      <Table dataSource={listFloorPoolsCollections} style={{ overflow: 'auto' }} pagination={false} columns={columns} loading={loading} />
      {hasMore && listFloorPoolsCollections && listFloorPoolsCollections.length >= globalConfig.paginationLimit && (
        <Action>
          <Button type='primary' ghost onClick={loadMore} loading={loading}>
            Load more
          </Button>
        </Action>
      )}
    </Content>
  )
}

const { Collection, Content, Action } = {
  Collection: styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    > span {
      color: black;
    }
  `,
  Content: styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
  `,
  Action: styled.div`
    width: 100%;
    text-align: center;
    button {
      width: 200px;
    }
  `
}
