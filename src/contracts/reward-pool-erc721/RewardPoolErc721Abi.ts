export const rewardPoolErc721Abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_rewardToken',
        type: 'address'
      }
    ],
    name: 'addRewardToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
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
        internalType: 'address',
        name: '_rewardToken',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_rewardPerSec',
        type: 'uint256'
      }
    ],
    name: 'updateRewardPerSec',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256[]',
        name: '_tokenIdList',
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
        name: '_tokenIdList',
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
    inputs: [{ internalType: 'uint256[]', name: '_tokenIdList', type: 'uint256[]' }],
    name: 'exit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
]
