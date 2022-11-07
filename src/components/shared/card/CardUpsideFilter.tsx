import { CloseOutlined } from '@ant-design/icons'
import { useReactiveVar } from '@apollo/client'
import { selectedMenuItemsVar, stakedOnlyVar } from '@graphql/variables/RewardPoolsVariables'
import { Col, Row, Space, Switch, Typography } from 'antd'
import { Button } from '../design-system'

interface CardUpsideFilterProps {
  itemsCount: number
  handleChangeFilter: (event: { key: string }) => void
}

export function CardUpsideFilter({ itemsCount, handleChangeFilter }: CardUpsideFilterProps) {
  const { Text } = Typography

  const selectedMenuItems = useReactiveVar(selectedMenuItemsVar)
  const stakedOnly = useReactiveVar(stakedOnlyVar)

  const handleStakedOnly = () => {
    stakedOnlyVar(!stakedOnly)
  }

  return (
    <Row justify='space-between' gutter={[0, 12]}>
      <Col>
        <Space direction='horizontal' size='small'>
          <Text type='secondary'> Items: {itemsCount}</Text>
          <Space size='small'>
            {selectedMenuItems.map(
              item =>
                item.key !== '' &&
                item.key !== 'collection_' && (
                  <Button onClick={() => handleChangeFilter(item)}>
                    {item.label}
                    <CloseOutlined />
                  </Button>
                )
            )}
          </Space>
        </Space>
      </Col>
      <Col>
        <Space>
          <Text>Staked Only:</Text>
          <Switch checked={stakedOnly} onChange={handleStakedOnly} />
        </Space>
      </Col>
    </Row>
  )
}
