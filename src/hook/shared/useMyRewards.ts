import { useQuery } from '@apollo/client'
import { RewardsQueryData, RewardsQueryVars, REWARDS_TOKEN_QUERY } from '../../graphql/pool/RewardsQuery'
import { notifyError } from '../../services/UtilService'

export function useMyRewards(
  chainId: number,
  hasStake: boolean,
  poolAddress: string,
  rewardTokenDecimals: number | null,
  rewardToken: string,
  account?: string
) {
  const { data, loading, refetch, startPolling, stopPolling } = useQuery<RewardsQueryData, RewardsQueryVars>(REWARDS_TOKEN_QUERY, {
    variables: {
      accountAddress: account ?? '',
      chainId,
      poolAddress,
      rewardToken,
      rewardTokenDecimals: rewardTokenDecimals ?? 0
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    skip: !account || !hasStake || rewardToken === '' || rewardTokenDecimals === null,
    onError: errorData => {
      if (errorData) {
        notifyError(errorData.networkError, 'Failed to obtain data rewards')
        stopPolling()
      }
    },
    onCompleted: () => {
      if (hasStake) {
        startPolling(60000)
      }
    }
  })
  return { reward: data?.rewards, loading, refetch }
}
