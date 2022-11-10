import { CheckOutlined } from '@ant-design/icons'
import { RewardPool } from '@appTypes/pool/RewardPool'

import { CardToken } from '@components/shared/card-token/CardToken'
import { CardTokenContainer } from '@components/shared/card-token/CardTokenContainer'
import { CardTokenImage } from '@components/shared/card-token/CardTokenImage'
import CardLoader from '@components/shared/card/CardLoader'
import { Col, Row } from 'antd'
import { useEffect } from 'react'
import styled from 'styled-components'
import { chainConfig } from '../../../../ChainConfig'
import { useErc721TokenIdListItems } from '../../../../hook/reward/erc721/useErc721TokenIdListItems'
import { SelectedNft } from './UnstakeErc721Modal'

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
    <Row gutter={[0, 8]}>
      {isLoadingUnstakedNfts && (
        <Col span={24}>
          <CardLoader />
        </Col>
      )}
      {!isLoadingUnstakedNfts &&
        unstakedNfts.map(item => (
          <Col span={24} key={`${item.address}#${item.chainId}`}>
            <CardTokenContainer>
              <CardTokenImage
                chainConfig={config}
                image={item.metadata?.image}
                native={pool.token.native}
                token={{
                  ...pool.token,
                  address: pool.token.id,
                  id: item.tokenId
                }}
              />
              <Col>
                <CheckIcon />
              </Col>
            </CardTokenContainer>
          </Col>
        ))}
      {!isLoadingUnstakedNfts && (
        <Col span={24}>
          <CardToken
            title='Earned'
            token={{ ...pool.rewards[0].token, address: pool.rewards[0].token.id }}
            chainId={chainId}
            image={pool.offchain?.stakeTokenImage}
            amount={rewardsEarned}
          />
        </Col>
      )}
    </Row>
  )
}

const { CheckIcon } = {
  CheckIcon: styled(CheckOutlined)`
    color: var(--primary-color);
  `
}
