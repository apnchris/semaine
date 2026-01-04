'use client'

import {useState, ReactNode} from 'react'

interface Filter {
  _id: string
  title?: string
  filterFn: (item: any) => boolean
}

interface FilterableContentProps {
  filters: Filter[]
  items: any[]
  children: (props: {
    filteredItems: any[]
    activeFilter: string
    setActiveFilter: (id: string) => void
  }) => ReactNode
}

export default function FilterableContent({filters, items, children}: FilterableContentProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all')

  const filteredItems =
    activeFilter === 'all'
      ? items
      : items.filter((item) => {
          const filter = filters.find((f) => f._id === activeFilter)
          return filter ? filter.filterFn(item) : true
        })

  return <>{children({filteredItems, activeFilter, setActiveFilter})}</>
}
