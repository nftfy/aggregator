import { chainConfig } from '@config/chain'
import { Button as ButtonAnt, ButtonProps as ButtonAntProps } from 'antd'
import { useCallback, useEffect, useState } from 'react'

interface ButtonProps extends ButtonAntProps {
  onChangeNetwork?: (chainId: number) => void
  onConnectWallet?: () => void
  accountAddress?: string
  currentChainId?: number | null | undefined
  chainId?: number
  skipStateValidation?: boolean
}

enum StateTypes {
  DEFAULT,
  DISCONNECTED,
  WRONG_NETWORK
}

export function Button({
  currentChainId,
  chainId,
  onChangeNetwork = () => {},
  onConnectWallet = () => {},
  accountAddress,
  skipStateValidation = true,
  ...rest
}: ButtonProps) {
  const [buttonState, setButtonState] = useState<StateTypes | undefined>()

  const expectedChain = chainConfig(chainId || 1)
  const isConnectedOnExpectedChain = expectedChain && currentChainId === expectedChain.chainId

  /**
   * this handler will prevent parent element of using passHref and
   * use onClick instead when a wallet connection is required
   */
  const handleEvent = (callback: () => void) => {
    return (e: MouseEvent) => {
      e.preventDefault()
      callback()
    }
  }

  const mergeButtonPropsByState = useCallback(
    (state?: StateTypes) => {
      if (state === StateTypes.DISCONNECTED)
        return {
          ...rest,
          ...{
            type: 'primary',
            ghost: true,
            children: 'Connect Wallet',
            onClick: handleEvent(onConnectWallet)
          }
        }

      if (state === StateTypes.WRONG_NETWORK)
        return {
          ...rest,
          ...{
            type: 'primary',
            ghost: true,
            children: `Change network to ${expectedChain.name}`,
            onClick: handleEvent(() => onChangeNetwork(expectedChain.chainId))
          }
        }

      return rest
    },
    [rest, expectedChain.name, expectedChain.chainId, onChangeNetwork, onConnectWallet]
  )

  useEffect(() => {
    if (skipStateValidation) return

    const isNotConnected = !accountAddress && !currentChainId
    const isWrongNetwork = !isConnectedOnExpectedChain

    if (!isNotConnected && !isWrongNetwork) {
      setButtonState(StateTypes.DEFAULT)
      return
    }

    if (isNotConnected) {
      setButtonState(StateTypes.DISCONNECTED)
      return
    }

    if (isWrongNetwork) {
      setButtonState(StateTypes.WRONG_NETWORK)
    }
  }, [skipStateValidation, currentChainId, accountAddress, isConnectedOnExpectedChain])

  return <ButtonAnt {...(mergeButtonPropsByState(buttonState) as ButtonAntProps)} />
}

export default Button
