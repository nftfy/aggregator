export const rewardPoolErc1155Abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_rewardToken',
        type: 'address'
      }
    ],
    name: 'harvest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256[]',
        name: '_ids',
        type: 'uint256[]'
      },
      {
        internalType: 'uint256[]',
        name: '_amounts',
        type: 'uint256[]'
      },
      {
        internalType: 'bool',
        name: '_claimRewards',
        type: 'bool'
      }
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256[]',
        name: '_ids',
        type: 'uint256[]'
      },
      {
        internalType: 'uint256[]',
        name: '_amounts',
        type: 'uint256[]'
      },
      {
        internalType: 'bool',
        name: '_claimRewards',
        type: 'bool'
      }
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256[]', name: '_ids', type: 'uint256[]' }],
    name: 'exit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
]
