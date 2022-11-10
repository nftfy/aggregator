import { SendTransactionResult } from '@wagmi/core'
import { useEffect, useState } from 'react'

export const useObserverTransaction = (data: SendTransactionResult | undefined, isSuccess: boolean, callback?: () => void) => {
  const [txt, setTxt] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleWait = async () => {
      await data?.wait()
      setIsLoading(false)
      callback && callback()
    }
    if (data && isSuccess) {
      setIsLoading(true)
      setTxt(data.hash)
      handleWait()
    }
  }, [data])

  return {
    txt,
    isLoading
  }
}
