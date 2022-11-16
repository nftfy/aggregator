const perpetualOpenCollectivePurchaseV2Abi = [
  {
    inputs: [
      { internalType: 'uint256', name: '_listingId', type: 'uint256' },
      { internalType: 'address payable', name: '_buyer', type: 'address' }
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_creator', type: 'address' },
      { internalType: 'address', name: '_collection', type: 'address' },
      { internalType: 'address', name: '_paymentToken', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      { internalType: 'uint256', name: '_maxReservePrice', type: 'uint256' },
      { internalType: 'bytes32', name: '_referralId', type: 'bytes32' }
    ],
    name: 'perpetualJoin',
    outputs: [{ internalType: 'uint256', name: '_listingId', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_creator', type: 'address' },
      { internalType: 'address', name: '_collection', type: 'address' },
      { internalType: 'address', name: '_paymentToken', type: 'address' }
    ],
    name: 'perpetualLeave',
    outputs: [{ internalType: 'uint256', name: '_listingId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  }
]

export default perpetualOpenCollectivePurchaseV2Abi
