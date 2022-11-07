import { CheckOutlined } from '@ant-design/icons'
import { RewardPool } from '@appTypes/pool/RewardPool'
import CardLoader from '@components/shared/card/CardLoader'
import { Col, Row } from 'antd'
import { useEffect } from 'react'
import styled from 'styled-components'
import { chainConfig } from '../../../../ChainConfig'
import { useErc721TokenIdListItems } from '../../../../hook/erc721/useErc721TokenIdListItems'
import { toHumanFormat } from '../../../../services/UtilService'
import CardToken from '../../../shared/card-token/CardToken'
import CardTokenContainer from '../../../shared/card-token/CardTokenContainer'
import CardTokenImage from '../../../shared/card-token/CardTokenImage'
import { SelectedNft } from './UnstakeErc1155Modal'


interface SuccessfulUnstakeNftProps {
  pool: RewardPool
  unstakedItems: SelectedNft[]
  rewardsEarned: string
  chainId: number
}

export function SuccessfulUnstakeNft({ chainId, rewardsEarned, pool, unstakedItems }: SuccessfulUnstakeNftProps) {
  const config = chainConfig(chainId)
  const {
    execute: obtainUnstakedNfts,
    erc721TargetByOwner: unstakedNfts,
    loading: isLoadingUnstakedNfts
  } = useErc721TokenIdListItems(
    chainId,
    pool.token.id,
    unstakedItems.map(item => `${item.tokenId || ''}`)
  )

  useEffect(() => {
    if (unstakedItems.length === 0) {
      return
    }

    obtainUnstakedNfts()
  }, [obtainUnstakedNfts, unstakedItems.length])

  return (
    <Row align='middle' gutter={[0, 8]}>
      {isLoadingUnstakedNfts && (
        <Col span={24}>
          <CardLoader />
        </Col>
      )}
      {!isLoadingUnstakedNfts &&
        unstakedNfts.map(item => (
          <Col span={24} key={`${item.address}#${item.chainId}`}>
            <CardTokenContainer gutter={0}>
              <CardTokenImage
                chainConfig={config}
                image={item.metadata?.image}
                native={pool.token.native}
                token={{
                  address: item.address,
                  id: item.tokenId,
                  name: item.name || item.symbol || pool.token.name || pool.token.symbol,
                  symbol: item.symbol || pool.token.symbol
                }}
              />
              <Col>
                <CheckIcon />
              </Col>
            </CardTokenContainer>
          </Col>
        ))}
      {!isLoadingUnstakedNfts &&
        unstakedNfts.length === 0 &&
        unstakedItems.map(item => (
          <Col span={24} key={`${item.tokenId}#${item.amount}`}>
            <CardToken
              gutter={0}
              title='My Stake'
              native={pool.token.native}
              chainId={chainId}
              amount={item.amount ? toHumanFormat(+item.amount) : '0'}
              token={{
                ...pool.token,
                address: pool.token.id,
                id: item.tokenId
              }}
            />
          </Col>
        ))}
      <Col span={24}>
        <CardToken
          gutter={0}
          title='Earned'
          token={{ ...pool.rewards[0].token, address: pool.rewards[0].token.id }}
          chainId={chainId}
          image={pool.offchain?.earnTokenImage}
          amount={rewardsEarned}
        />
      </Col>
    </Row>
  )
}

const { CheckIcon } = {
  CheckIcon: styled(CheckOutlined)`
    color: var(--primary-color);
  `
}
