import { Expiration } from '@appTypes/pool/RewardPool'
import debounce from 'lodash.debounce'
import { Duration } from 'luxon'
import { useEffect, useMemo, useState } from 'react'

export interface UseRemainingTime {
  label: string
  isExpired: boolean
}

export function useRemainingTime({ days = 0, hours = 0, minutes = 0, seconds = 0 }: Partial<Expiration>): UseRemainingTime {
  const [duration, setDuration] = useState(Duration.fromObject({ days, hours, minutes, seconds }))

  const isExpired = useMemo(() => {
    const hasTime = duration.toMillis() > 0

    return !hasTime
  }, [duration])

  const label = useMemo(() => {
    return [
      [duration.days, 'd'],
      [duration.hours, 'h'],
      [duration.minutes, 'm'],
      [duration.seconds, 's']
    ]
      .map(([time, text]) => `${String(time).padStart(2, '0')}:${text}`)
      .join(' ')
  }, [duration.days, duration.hours, duration.minutes, duration.seconds])

  const handleUpdateDuration = debounce(() => {
    const updatedDuration = Duration.fromDurationLike(duration).minus(1000).shiftTo('days', 'hours', 'minutes', 'seconds').toObject()
    const hasTime = Object.keys(updatedDuration).some(key => !!duration[key as keyof Duration])

    if (!hasTime) {
      return
    }

    const newDuration = Duration.fromDurationLike({
      days: updatedDuration.days,
      hours: updatedDuration.hours,
      minutes: updatedDuration.minutes,
      seconds: updatedDuration.seconds
    })

    setDuration(newDuration)
  })

  useEffect(() => {
    setDuration(Duration.fromObject({ days, hours, minutes, seconds }))
  }, [days, hours, minutes, seconds])

  useEffect(() => {
    const interval = setInterval(() => {
      handleUpdateDuration()
    }, 1000)

    return () => clearInterval(interval)
  }, [handleUpdateDuration])

  return { label, isExpired }
}

export default useRemainingTime
