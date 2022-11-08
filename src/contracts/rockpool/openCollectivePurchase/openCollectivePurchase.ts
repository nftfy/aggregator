import axios from 'axios'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { chainConfig } from '../../../ChainConfig'
import { SpecificPoolItem } from '../../../models/rockpool/SpecificPoolsTypes'
import { units } from '../../../services/UtilService'
import perpetualOpenCollectivePurchaseAbi from './openCollectivePurchaseAbi.json'

interface OpenCollectivePurchaseProps {
  join(specificPoolItem: SpecificPoolItem, value: string): Promise<string>
  leave(specificPoolItem: SpecificPoolItem): Promise<string>
  verifyRockpoolAvailability(rockpoolId: string, creator?: string): Promise<boolean>
  listPool(
    collectionAddress: string,
    tokenId: string | string[] | undefined,
    privatePool: boolean,
    account: string | undefined,
    name: string,
    symbol: string,
    priceMultiplier: string,
    curatorsFee: number
  ): Promise<string>
  claim(listingId: string, buyer: string): Promise<string>
}

export const openCollectivePurchase = (signerProvider: ethers.providers.Web3Provider, chainId: number): OpenCollectivePurchaseProps => {
  const signer: ethers.Signer = signerProvider.getSigner()
  const config = chainConfig(chainId)
  const perpetualOpenCollectivePurchaseAddress = config.products.specific.contract.openCollectivePurchase

  const perpetualOpenCollectivePurchase: ethers.Contract = new ethers.Contract(
    perpetualOpenCollectivePurchaseAddress,
    perpetualOpenCollectivePurchaseAbi,
    signer
  )

  return {
    async join(specificPoolItem, value) {
      try {
        const isNetworkToken = specificPoolItem.paymentToken.id === config.nativeToken.address
        const amountInUnits = units(value, specificPoolItem.paymentToken.decimals || 0)

        const reservePriceInUnits = units(specificPoolItem.reservePrice || '0', specificPoolItem.paymentToken.decimals)
        const joinTransaction: ethers.Transaction = await perpetualOpenCollectivePurchase.join(
          specificPoolItem.id,
          amountInUnits,
          reservePriceInUnits,
          isNetworkToken ? { value: amountInUnits } : { value: 0 }
        )
        return joinTransaction.hash as string
      } catch (error) {
        throw new Error(error as string)
      }
    },
    async leave(specificPoolItem) {
      try {
        const leaveTransaction: ethers.Transaction = await perpetualOpenCollectivePurchase.leave(specificPoolItem.id)
        return leaveTransaction.hash as string
      } catch (error) {
        throw new Error(error as string)
      }
    },
    async verifyRockpoolAvailability(rockpoolId: string, creator?: string): Promise<boolean> {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
        const uri = baseUrl ? baseUrl.replace('/graphql', '') : ''

        const url = creator
          ? `${uri}/rockpool/update-opensea-availability/${rockpoolId}/${chainId}/${creator}`
          : `${uri}/rockpool/update-opensea-availability/${rockpoolId}/${chainId}`

        await axios.get(url)
        return true
      } catch (e) {
        return false
      }
    },
    listPool: async (
      collectionAddress: string,
      tokenId: string,
      privatePool: boolean,
      account: string | undefined,
      name: string,
      symbol: string,
      priceMultiplier: string,
      curatorsFee = 0
    ): Promise<string> => {
      try {
        const typeBytes = ethers.utils.formatBytes32String('AUCTION')
        const communityFeeUnits = units(Number(0).toString(10), 18)
        const curatorsFeePercentage = curatorsFee / 100
        const curatorsFeeUnits = units(curatorsFeePercentage.toString(10), 18)
        const duration = 259200
        const multiplier = new BigNumber(priceMultiplier).multipliedBy(100).toString()

        const abi = ethers.utils.defaultAbiCoder
        const extras = abi.encode(
          ['bytes32', 'string', 'string', 'uint256', 'uint256'],
          [typeBytes, name, symbol, duration, communityFeeUnits]
        )

        const tx = await perpetualOpenCollectivePurchase.list(
          collectionAddress,
          tokenId,
          privatePool,
          curatorsFeeUnits,
          config.nativeToken.address,
          multiplier,
          extras
        )

        return tx.hash as string
      } catch (error) {
        throw new Error(error as string)
      }
    },
    claim: async (listingId: string, buyer: string) => {
      try {
        const claimTransaction: ethers.Transaction = await perpetualOpenCollectivePurchase.claim(listingId, buyer)
        return claimTransaction.hash as string
      } catch (error) {
        throw new Error(error as string)
      }
    }
  }
}
