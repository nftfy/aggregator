import axios from 'axios'
import { useEffect } from 'react'
import { globalConfig } from '../../../config'
export const useSpecificVerifyAvailability = (chainId: number, specificPoolId: string, listed = false, specificCreator?: string) => {
  useEffect(() => {
    const verifyAvailability = async () => {
      try {
        const baseUrl = globalConfig.nftfy.api.base
        const uri = baseUrl ? baseUrl.replace('/graphql', '') : ''

        const url = listed
          ? `${uri}/rockpool/update-opensea-availability/${specificPoolId}/${chainId}/${specificCreator}`
          : `${uri}/rockpool/update-opensea-availability/${specificPoolId}/${chainId}`

        await axios.get(url)
        return true
      } catch (e) {
        return false
      }
    }
    verifyAvailability()
  }, [])
}
