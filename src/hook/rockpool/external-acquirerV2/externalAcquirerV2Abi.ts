const externalAcquirerV2Abi = [
  {
    inputs: [
      { internalType: 'uint256', name: '_listingId', type: 'uint256' },
      { internalType: 'bool', name: '_relist', type: 'bool' },
      { internalType: 'bytes', name: '_data', type: 'bytes' }
    ],
    name: 'acquire',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
]

export default externalAcquirerV2Abi
