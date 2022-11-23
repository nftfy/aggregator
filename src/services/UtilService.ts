import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import humanFormat from 'human-format'
import moment from 'moment'
import { EthereumTestNetworks } from '../ChainConfig'
import { globalConfig } from '../config'

export const formatToLocaleString = (
  value: string | number | BigNumber,
  maximumFractionDigits?: number,
  minimumFractionDigits?: number
) => {
  return new BigNumber(value).toNumber().toLocaleString('en-US', { maximumFractionDigits, minimumFractionDigits })
}

export const checkEthereumTestNet = (chainId: number): boolean => Object.values(EthereumTestNetworks).includes(chainId)

export function toHumanFormat(value: number): string {
  if (value === 0 || Number.isNaN(value)) {
    return '0'
  }
  if (value > 0 && value < 1) {
    return formatToLocaleString(value, 5)
  }

  return humanFormat(Number(value), {
    separator: ''
  })
    .replace('G', 'B') // Necessary since the prefix for short scale is B, not G: https://en.wikipedia.org/wiki/Metric_prefix
    .toLowerCase()
}

export function formatSymbol(tokenSymbol: string) {
  return tokenSymbol.length > 6 ? `${tokenSymbol.substr(0, 6)}...` : tokenSymbol
}

export function valid(amount: string, decimals: number): boolean {
  const regex = new RegExp(`^\\d+${decimals > 0 ? `(\\.\\d{1,${decimals}})?` : ''}$`)
  return regex.test(amount)
}

export function units(coinsValue: string, decimals: number): string {
  if (coinsValue.slice(-1) === '.' || !coinsValue) return ''
  if (!valid(coinsValue, decimals)) throw new Error('Invalid amount')
  let i = coinsValue.indexOf('.')
  if (i < 0) i = coinsValue.length
  const s = coinsValue.slice(i + 1)
  return coinsValue.slice(0, i) + s + '0'.repeat(decimals - s.length)
}

export function coins(unitsValue: string, decimals: number): string {
  if (unitsValue.slice(-1) === '.' || !unitsValue) return ''
  if (!valid(unitsValue, 0)) throw new Error('Invalid amount')
  if (decimals === 0) return unitsValue
  const s = unitsValue.padStart(1 + decimals, '0')
  return `${s.slice(0, -decimals)}.${s.slice(-decimals)}`
}

export function getGasLimit(estimate: ethers.BigNumber, decimals = 18) {
  return new BigNumber(estimate.toString(), decimals).multipliedBy(1.2).toFixed(0).toString()
}

export async function getGasPrice(provider: ethers.providers.JsonRpcProvider) {
  const price = await provider.getGasPrice()
  return new BigNumber(price.toString()).multipliedBy(1.2).toFixed(0).toString()
}

export function notifyError(error: unknown, message: string, silent?: boolean) {
  // eslint-disable-next-line no-console
  console.error(error)
  if (!silent) {
    // Toast.error(message)
  }
}

export function formatDecimals(value: string, decimals: number) {
  const og = 10 ** decimals
  return Math.trunc(Number(value) * og) / og
}

export function formatShortAccountName(address: string, size = 6): string {
  const finalChar = address.length > size && address.slice(-4)
  return [address.slice(0, size), finalChar].filter(Boolean).join('...')
}

export function cryptoInputValidForm(value: string) {
  let updatedValue = value

  if (updatedValue[0] === '.') {
    updatedValue = `0${value}`
  }

  if (updatedValue.length > 0 && updatedValue[updatedValue.length - 1] === '.' && updatedValue.slice(0, -1).includes('.')) {
    updatedValue = updatedValue.slice(0, -1)
  }

  updatedValue = updatedValue.replace(/[^0-9.]/g, '')
  return updatedValue
}

export function formatTimestamp(timestamp: number) {
  if (!timestamp) {
    return 'no date'
  }
  const date = moment.unix(timestamp).format('DD MMM YYYY')

  return date
}

export function redirectToShowFractions(chainId: number, fraction: string) {
  window.open(`${globalConfig.nftfy.marketplaceUrl}/marketplace/${chainId}/detail/${fraction}`, '_blank')
}
