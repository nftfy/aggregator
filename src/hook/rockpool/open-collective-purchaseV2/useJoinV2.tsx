import { ethers } from 'ethers'
import { usePrepareContractWrite, useSendTransaction } from 'wagmi'
import { chainConfig } from '../../../ChainConfig'
import { useObserverTransaction } from '../../shared/useObserveTransaction'
import perpetualOpenCollectivePurchaseV2Abi from './perpetualOpenCollectivePurchaseV2Abi'

const useJoinV2 = (
  collection: string,
  paymentToken: string,
  amount: ethers.BigNumber,
  maxReservePrice: ethers.BigNumber,
  referralId: number,
  chainId: number,
  creatorAddress?: string
) => {
  const { products, nativeToken } = chainConfig(chainId)
  let perpetualJoinOptions
  if (paymentToken === ethers.constants.AddressZero) {
    perpetualJoinOptions = { value: amount }
  } else {
    perpetualJoinOptions = { value: 0 }
  }

  const referralIdBytes32: string = ethers.utils.hexZeroPad(ethers.utils.hexlify(referralId), 32)

  const { config } = usePrepareContractWrite({
    addressOrName: products.buyFloor.contract.perpetualOpenCollectivePurchaseV2,
    contractInterface: perpetualOpenCollectivePurchaseV2Abi,
    functionName: 'perpetualJoin',
    args: [
      creatorAddress?.length ? creatorAddress : nativeToken.address,
      collection,
      paymentToken,
      amount,
      maxReservePrice,
      referralIdBytes32,
      perpetualJoinOptions
    ]
  })
  const { sendTransaction, isSuccess, data, isLoading } = useSendTransaction(config)
  const { status, dismiss } = useObserverTransaction(data, isSuccess, products.buyFloor.subgraph)

  const join = async () => {
    if (sendTransaction) {
      await sendTransaction()
    }
  }

  return {
    join,
    isLoading: isLoading,
    status,
    dismiss
  }
}

export default useJoinV2
