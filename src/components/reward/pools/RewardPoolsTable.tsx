import Link from 'next/link'
import styled from 'styled-components'
import { chainConfig } from '../../../ChainConfig'
import { RewardPool } from '../../../types/pool/RewardPool'
import { Button } from '../../shared/design-system'
import ProgramDetailsDailyRewards from '../../shared/program/details/DailyRewards'
import ProgramDetailsEarn from '../../shared/program/details/Earn'
import ProgramDetailsParticipants from '../../shared/program/details/Participants'
import ProgramDetailsStake from '../../shared/program/details/Stake'
import { ProgramDetailsTimeLeftByPool } from '../../shared/program/details/TimeLeftByPool'

interface RewardPoolsTableProps {
  chainId: number
  stakingPools: RewardPool[]
  loading: boolean
}

export const RewardPoolsTable = ({ chainId, stakingPools, loading }: RewardPoolsTableProps) => {
  const config = chainConfig(chainId)
  const headings = [
    { name: 'Earn', align: 'left' },
    { name: 'Stake', align: 'left' },
    { name: 'Daily Rewards', align: 'left' },
    { name: 'Ends in', align: 'left' },
    { name: 'Participants', align: 'left' },
    { name: '', align: 'center' }
  ]

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
        {!!stakingPools.length &&
          stakingPools.map(pool => (
            <tr key={pool.id} className='h-24 border-b border-gray-300 dark:border-[#525252]'>
              <td className=''>
                <ProgramDetailsEarn
                  showTitle={false}
                  earn={{
                    id: pool.rewards[0].token.id,
                    url: pool.rewards[0].token.id && `${config.scanAddress}/address/${pool.rewards[0].token.id}`,
                    label: pool.rewards[0].token?.symbol,
                    address: pool.rewards[0].token.id,
                    image: pool.offchain?.earnTokenImage,
                    diameter: 40
                  }}
                />
              </td>
              <td className=''>
                <ProgramDetailsStake
                  showTitle={false}
                  stake={{
                    url: `${config.scanAddress}/address/${pool.token.id}`,
                    label: pool.token.symbol,
                    address: pool.token.id,
                    image: pool.offchain?.stakeTokenImage,
                    diameter: 40
                  }}
                />
              </td>
              <td>
                <ProgramDetailsDailyRewards
                  showTitle={false}
                  dailyRewards={{
                    amount: pool?.rewards[0]?.dailyRewards,
                    label: pool?.rewards[0]?.token?.symbol || pool?.rewards[0]?.token?.name
                  }}
                />
              </td>
              <td>
                <ProgramDetailsTimeLeftByPool pool={pool} />
              </td>
              <td>
                <ProgramDetailsParticipants count={pool?.userCount} />
              </td>
              <ActionCell className='items-center'>
                <Link href={['/reward', pool?.address].join('/')} passHref>
                  <Button type='primary' block style={{ width: 148 }}>
                    Enter pool
                  </Button>
                </Link>
              </ActionCell>
            </tr>
          ))}
      </tbody>
    </table>
  )
}

const { ActionCell } = {
  ActionCell: styled.td`
    display: flex;
    justify-content: end;
    height: inherit;
  `
}
