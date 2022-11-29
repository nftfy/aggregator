import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'

export const usePoolDailyRewards = (rewardPerSec?: string) => {
  const [dailyRewards, setDailyRewards] = useState<string>('0')

  useEffect(() => {
    setDailyRewards(new BigNumber(rewardPerSec || 0).multipliedBy(60).multipliedBy(60).multipliedBy(24).toString())
  }, [rewardPerSec])

  return {
    dailyRewards
  }
}
