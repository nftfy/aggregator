import { Card } from 'antd';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import RewardPoolERC1155Detail from '../../src/components/reward/pool-erc1155/RewardPoolERC1155Detail';
import { RewardPoolERC1155Stake } from '../../src/components/reward/pool-erc1155/RewardPoolERC1155Stake';
import RewardPoolERC721Detail from '../../src/components/reward/pool-erc721/RewardPoolERC721Detail';
import { RewardPoolERC721Stake } from '../../src/components/reward/pool-erc721/RewardPoolERC721Stake';
import { RewardPoolDetails } from '../../src/components/reward/pool/RewardPoolDetails';
import RewardPoolInfo from '../../src/components/reward/pool/RewardPoolInfo';
import { RewardPoolSocialInfo } from '../../src/components/reward/pool/RewardPoolSocialInfo';
import { DefaultPageTemplate } from '../../src/components/shared/DefaultPageTemplate';
import useRemainingTime from '../../src/hook/shared/useRemainingTime';
import { useStakingPool } from '../../src/hook/shared/useStakingPool';



interface PageStakeDetailsProps {
  chainId: number
  network: string
  poolAddress: string
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const poolAddress = String(ctx.params?.poolAddress)

 
  
  return {
    props: {
      poolAddress
    }
  }
}

function PageStakeDetails({ poolAddress }: PageStakeDetailsProps) {
  const { address } = useAccount()
  const accountAddress = address?.toLowerCase()
  const router = useRouter()
  const { chain } = useNetwork()
  
  const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)
  const {
    data: pool,
    getPool,
    loading,
  } = useStakingPool({chainId:5, poolAddress, accountAddress})

  const remainingTime = useRemainingTime({ ...pool?.rewards[0]?.expirationInfo })

  const { name, info } = useMemo(() => {
    return {
      name:
        pool?.offchain?.name ||
        ['Stake', pool?.token?.name || pool?.token?.symbol, 'Earn', pool?.rewards[0]?.token?.name || pool?.rewards[0]?.token?.symbol].join(
          ' '
        ),
      info: {
        ...pool?.offchain,
        items: pool?.items.length,
        owners: pool?.userCount
      }
    }
  }, [pool])

  const handleGetPool = useCallback(async () => {
    await getPool({
      chainId,
      poolAddress,
      accountAddress
    })
  }, [getPool, chainId, poolAddress, accountAddress])

  return (
    <DefaultPageTemplate
      title={name}
      product='reward'
      subHeader={{
        pageHeaderTitle: name,
        pageHeaderAfter: pool && <RewardPoolSocialInfo poolAddress={pool?.address} network={String(chain?.name)} chainId={chainId} />,
        onBack:router.back
        
      }}
    >
      <RewardPoolDetails
        info={<RewardPoolInfo {...info} />}
        detail={
          <Card loading={loading}>
            <h1>Program Detail</h1>
            {pool &&
              {
                'ERC-721': <RewardPoolERC721Detail pool={pool} chainId={chainId} remainingTime={remainingTime} />,
                'ERC-1155': <RewardPoolERC1155Detail pool={pool} chainId={chainId} remainingTime={remainingTime} />
              }[pool.type]}
          </Card>
        }
        stake={
          <Card loading={loading}>
            <h1>Stake</h1>
            {pool &&
              {
                'ERC-721': (
                  <RewardPoolERC721Stake
                    onGetPool={handleGetPool}
                    isExpired={remainingTime.isExpired}
                    pool={pool}
                    chainId={chainId}
                    stakeTokenImage={pool?.offchain?.stakeTokenImage}
                    accountAddress={String(accountAddress)}
                  />
                ),
                'ERC-1155': (
                  <RewardPoolERC1155Stake
                    onGetPool={handleGetPool}
                    isExpired={remainingTime.isExpired}
                    pool={pool}
                    chainId={chainId}
                    stakeTokenImage={pool?.offchain?.stakeTokenImage}
                    accountAddress={String(accountAddress)}
                  />
                )
              }[pool.type]}
          </Card>
        }
      />
    </DefaultPageTemplate>
  )
}

export default PageStakeDetails
