import { useState } from 'react'
import FloorClaimTable from './FloorClaimTable'
import SpecificClaimTable from './SpecificClaimTable'

export interface RockpoolProfileTableProps {
  chainId: number
  walletAddress: string
}

interface Filter {
  name: string
  key: string
  active: boolean
}

export default function RockpoolProfileTable({ chainId, walletAddress }: RockpoolProfileTableProps) {
  const [filters, setFilters] = useState<Filter[]>([
    { name: 'Specific', key: 'specific', active: true },
    { name: 'Floor', key: 'floor', active: false }
  ])

  const handleActiveFilter = (activeFilter: Filter) => {
    const newFilters: Filter[] = []
    filters.forEach(filter => {
      if (filter.key === activeFilter.key) {
        newFilters.push({ ...filter, active: true })
        return
      }
      newFilters.push({ ...filter, active: false })
    })
    setFilters(newFilters)
  }

  const handleFilter = (filter: Filter) => {
    switch (filter.key) {
      case 'specific':
        return <SpecificClaimTable chainId={chainId} walletAddress={walletAddress} />
      case 'floor':
        return <FloorClaimTable chainId={chainId} walletAddress={walletAddress} />
    }
  }
  return (
    <>
      <div className='mt-2 flex flex-wrap gap-2 md:m-5 md:gap-4'>
        {filters.map((filter, i) => {
          return (
            <button
              key={i}
              className={`flex gap-3 rounded-full px-4 py-3 md:hover:bg-primary-100 dark:md:hover:bg-neutral-600 ${
                filter.active
                  ? 'border-[1px] border-transparent bg-primary-100 dark:bg-neutral-600'
                  : 'border-[1px] border-neutral-300 bg-white dark:bg-black'
              }`}
              onClick={() => handleActiveFilter(filter)}
            >
              {filter.name}
            </button>
          )
        })}
      </div>
      {handleFilter(filters.filter(filter => filter.active === true)[0])}
    </>
  )
}
