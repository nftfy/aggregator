import { makeVar, useReactiveVar } from '@apollo/client'
import { Button, Input, List, Modal, Typography } from 'antd'
import Fuse from 'fuse.js'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { FloorCollectionList } from '../../../../../graphql/buyfloor/FloorCollection'
import { useFloorCollection } from '../../../../../hooks/query/buyFloor/useFloorCollection'
import { TokenImage } from '../../../../shared/TokenImage'

export const floorCollectionModalVar = makeVar(false)

interface FloorCollectionModalProps {
  chainId: number
}

export default function FloorCollectionModal({ chainId }: FloorCollectionModalProps) {
  const { floorCollection, loading } = useFloorCollection(chainId)

  const { Search } = Input
  const { Text } = Typography

  const floorCollectionModal = useReactiveVar(floorCollectionModalVar)
  const [searchFilter, setSearchFilter] = useState<FloorCollectionList[]>([])

  const optionsFilter = {
    includeScore: true,
    keys: ['collectionAddress', 'collectionName', 'collectionSlug']
  }

  const fuse = new Fuse(floorCollection || [], optionsFilter)

  useEffect(() => {
    if (floorCollection) setSearchFilter(floorCollection)
  }, [floorCollection])

  const handleSearch = (search: string) => {
    const results = fuse.search(search)
    const arraySearch: FloorCollectionList[] = []

    results.forEach(result => arraySearch.push(result.item))

    if (!search && arraySearch.length === 0 && floorCollection) {
      setSearchFilter(floorCollection)
    } else {
      setSearchFilter(arraySearch)
    }
  }

  const handleCancel = () => {
    floorCollectionModalVar(false)
  }

  return (
    <Modal title='New buy floor pool' footer='' open={floorCollectionModal} onOk={handleCancel} onCancel={handleCancel} destroyOnClose>
      <ContentModal>
        <Search
          placeholder='Search collections (name, slug or address)'
          onChange={text => handleSearch(text.target.value)}
          allowClear
          style={{ width: '100%' }}
        />
        {searchFilter.length >= 1 && (
          <List
            itemLayout='horizontal'
            dataSource={searchFilter}
            loading={loading}
            renderItem={item => (
              <List.Item key={item.collectionAddress}>
                <Button type='link' style={{ padding: '0px' }}>
                  <List.Item.Meta
                    avatar={<TokenImage address={item.collectionAddress} diameter={35} shape='circle' chainId={5} />}
                    title={item.collectionName}
                    style={{ alignItems: 'center' }}
                  />
                </Button>
              </List.Item>
            )}
          />
        )}
        {searchFilter.length === 0 && <Text type='danger'>No results found</Text>}
      </ContentModal>
    </Modal>
  )
}

const { ContentModal } = {
  ContentModal: styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
  `
}
