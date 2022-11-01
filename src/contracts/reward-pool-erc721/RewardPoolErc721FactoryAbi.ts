export const rewardPoolErc721FactoryAbi = [
  {
    inputs: [
      { internalType: 'uint96', name: '_index', type: 'uint96' },
      { internalType: 'address', name: '_token', type: 'address' }
    ],
    name: 'createPool',
    outputs: [{ internalType: 'address', name: '_pool', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function'
  }
]
