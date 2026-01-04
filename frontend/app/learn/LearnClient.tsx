'use client'

import Link from 'next/link'
import SanityImage from '@/app/components/SanityImage'
import FilterableContent from '@/app/components/FilterableList'
import styles from '../css/pages/learn.module.css'

interface LearnEntry {
  _id: string
  _type: 'learnEntry'
  title: string
  slug: {
    current: string
  }
  button?: string
  filters?: Array<{_id: string}>
  featuredImage?: {
    asset: {
      _id: string
      url: string
    }
    alt?: string
  }
}

interface LearnClientProps {
  pageData: any
  sortedEntries: LearnEntry[]
}

export default function LearnClient({pageData, sortedEntries}: LearnClientProps) {
  // Build filter configuration in the client component
  const filterConfig = [
    // Add custom filters from Sanity
    ...(pageData?.filters || []).map((filter: any) => ({
      _id: filter._id,
      title: filter.title,
      filterFn: (entry: LearnEntry) => {
        // Check if the entry has this filter in their filters array
        return entry.filters?.some((f) => f._id === filter._id) || false
      },
    })),
  ]

  return (
    <FilterableContent filters={filterConfig} items={sortedEntries}>
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
              <h1 className="font-l">{pageData?.title || 'Learn'}</h1>
              {pageData?.text && <p className="font-m">{pageData.text}</p>}
            </div>
          </div>

          <div className={styles.profileGrid}>
            {filteredItems.length > 0 ? (
              filteredItems.map((entry: LearnEntry) => {
                return (
                  <Link
                    key={entry._id}
                    href={`/learn/${entry.slug.current}`}
                    className={styles.learnCard}
                  >
                    {entry.featuredImage?.asset && (
                      <div className={styles.entryImageWrapper}>
                        <SanityImage
                          id={entry.featuredImage.asset._id}
                          alt={entry.featuredImage.alt || entry.title}
                          className={styles.entryImage}
                          width={720}
                          height={820}
                          mode="cover"
                        />
                      </div>
                    )}

                    <div className={styles.entryInfo}>
                      <h3 className={`${styles.entryTitle} font-l`}>{entry.title}</h3>
                      <div className={styles.entryButtons}>
                        {entry.button && <p className="blur-back favorite-button font-s">V</p>}
                        {entry.button && <p className="blur-back font-s">{entry.button}</p>}
                      </div>
                    </div>
                  </Link>
                )
              })
            ) : (
              <p className={`${styles.emptyText}`}>No content found :(</p>
            )}
          </div>
        </div>
      )}
    </FilterableContent>
  )
}
