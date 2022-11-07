import { makeVar } from '@apollo/client'

export const isManagePoolConfirmedVar = makeVar<boolean>(false)
export const stakedOnlyVar = makeVar<boolean>(false)
export const selectedMenuItemsVar = makeVar<{ key: string; label: string; type: 'status' | 'collection' | 'network' }[]>([])
