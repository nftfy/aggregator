import { makeVar } from '@apollo/client'

export const isManagePoolConfirmedVar = makeVar<boolean>(false)
export const currentPoolAddressVar = makeVar<string>('')
