'use client'

import Link from 'next/link'
import SanityImage from '@/app/components/SanityImage'
import FilterableContent from '@/app/components/FilterableList'
import styles from '../css/pages/tastemakers.module.css'

interface Person {
  _id: string
  _type: 'tasteMaker' | 'tasteBreaker'
  name: string
  slug: {
    current: string
  }
  title?: string
  filters?: Array<{_id: string}>
  picture?: {
    asset: {
      _id: string
      url: string
    }
    alt?: string
  }
}

interface TastemakersClientProps {
  pageData: any
  sortedPeople: Person[]
}

export default function TastemakersClient({
  pageData,
  sortedPeople,
}: TastemakersClientProps) {
  // Build filter configuration in the client component
  const filterConfig = [
    {
      _id: 'tastemakers',
      title: 'Taste Makers',
      filterFn: (person: Person) => person._type === 'tasteMaker',
    },
    {
      _id: 'tastebreakers',
      title: 'Taste Breakers',
      filterFn: (person: Person) => person._type === 'tasteBreaker',
    },
    // Add custom filters from Sanity
    ...(pageData?.filters || []).map((filter: any) => ({
      _id: filter._id,
      title: filter.title,
      filterFn: (person: Person) => {
        // Check if the person has this filter in their filters array
        return person.filters?.some((f) => f._id === filter._id) || false
      },
    })),
  ]

  return (
    <FilterableContent filters={filterConfig} items={sortedPeople}>
      {({filteredItems, activeFilter, setActiveFilter}) => (
        <div>
          <div className={`${styles.introFilters} main-grid`}>
            <div className={`${styles.filters} filters-container font-s`}>
              <div className="filter-title">Filter</div>

              <div className="filter-content">
                <ul className="filter-list">
                  <li
                    className={`filter-item ${activeFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('all')}
                  >
                    <span className="filter-marker">
                      <span>(</span>
                      <span>)</span>
                    </span>
                    <span>All</span>
                  </li>
                  <li
                    className={`filter-item ${activeFilter === 'tastemakers' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('tastemakers')}
                  >
                    <span className="filter-marker">
                      <span>(</span>
                      <span>)</span>
                    </span>
                    <span>
                      Taste<span style={{color: '#6881f5'}}>Makers</span>
                    </span>
                  </li>
                  <li
                    className={`filter-item ${activeFilter === 'tastebreakers' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('tastebreakers')}
                  >
                    <span className="filter-marker">
                      <span>(</span>
                      <span>)</span>
                    </span>
                    <span>
                      Taste<span style={{color: '#ffbd00'}}>Breakers</span>
                    </span>
                  </li>
                  {(pageData?.filters || []).map((filter: any) => (
                    <li
                      key={filter._id}
                      className={`filter-item ${activeFilter === filter._id ? 'active' : ''}`}
                      onClick={() => setActiveFilter(filter._id)}
                    >
                      <span className="filter-marker">
                        <span>(</span>
                        <span>)</span>
                      </span>
                      <span>{filter.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={styles.intro}>
              <h1 className="font-l">{pageData?.title || 'Taste Makers & Breakers'}</h1>
              {pageData?.text && <p className="font-m">{pageData.text}</p>}
            </div>
          </div>

          <div className={styles.profileGrid}>
            {filteredItems.length > 0 ? (
              filteredItems.map((person: Person) => {
                const basePath = person._type === 'tasteMaker' ? 'tastemakers' : 'tastebreakers'
                const cardClass =
                  person._type === 'tasteMaker' ? styles.tastemakerCard : styles.tastebreakerCard

                return (
                  <Link
                    key={person._id}
                    href={`/${basePath}/${person.slug.current}`}
                    className={`${styles.profileCard} ${cardClass || ''}`}
                  >
                    {person.picture?.asset && (
                      <div className={styles.profileImageWrapper}>
                        <SanityImage
                          id={person.picture.asset._id}
                          alt={person.picture.alt || person.name}
                          className={styles.profileImage}
                          width={475}
                          height={600}
                          mode="cover"
                        />
                      </div>
                    )}

                    <div className={styles.profileInfo}>
                      <h3 className="font-m">{person.name}</h3>
                      {person.title && <p className="font-s">{person.title}</p>}
                    </div>
                  </Link>
                )
              })
            ) : (
              <p>No taste makers or breakers found.</p>
            )}
          </div>
        </div>
      )}
    </FilterableContent>
  )
}
