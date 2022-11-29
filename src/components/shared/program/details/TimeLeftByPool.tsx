import { RewardPool } from '@appTypes/pool/RewardPool'
import useRemainingTime from '../../../../hook/shared/useRemainingTime'
import ProgramDetailsTimeLeft from './TimeLeft'
interface ProgramDetailsTimeLeftByPoolProps {
  pool: RewardPool
}

export const ProgramDetailsTimeLeftByPool = ({ pool }: ProgramDetailsTimeLeftByPoolProps) => {
  const remainingTime = useRemainingTime({ ...pool?.rewards[0]?.expirationInfo })

  return <ProgramDetailsTimeLeft progress={pool?.rewards[0]?.progress} label={remainingTime.label} isExpired={remainingTime.isExpired} />
}
