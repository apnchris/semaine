'use client'

import {useState} from 'react'
import Link from 'next/link'
import SanityImage from '@/app/components/SanityImage'
import FilterableContent from '@/app/components/FilterableList'
import styles from '../css/pages/learn.module.css'
import {GridIcon, ListIcon} from '@/app/components/Vectors'
import FavoriteButton from '@/app/components/FavoriteButton'

interface LearnEntry {
  _id: string
  _type: 'learnEntry'
  title: string
  slug: {
    current: string
  }
  button?: string
  excerpt?: string
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [hoveredEntry, setHoveredEntry] = useState<LearnEntry | null>(null)

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

              <div className={styles.memberContainer}>
                <p className="font-s">Exclusive content for Members</p>
                <div className={`font-m ${styles.memberActions}`}>
                  <Link href="#">
                    Log In
                  </Link>
                  <Link href="#">
                    Subscribe
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.profileGrid} ${viewMode === 'list' ? styles.listView : ''}`}>
            {filteredItems.length > 0 ? (
              filteredItems.map((entry: LearnEntry) => {
                const isNotHovered = hoveredEntry && hoveredEntry._id !== entry._id
                return (
                  <div key={entry._id} className={`${styles.learnCard} ${isNotHovered ? styles.notHovered : ''}`}>
                    <Link
                      href={`/learn/${entry.slug.current}`}
                      className={`${styles.learnCardLink}`}
                    >
                      {entry.featuredImage?.asset && viewMode === 'grid' && (
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

                      {entry.featuredImage?.asset && viewMode === 'list' && (
                        <div 
                          className={styles.entryTitleWrapper}
                          onMouseEnter={() => setHoveredEntry(entry)}
                          onMouseLeave={() => setHoveredEntry(null)}
                        >
                          <h3 className={`${styles.entryTitle} font-l`}>{entry.title}</h3>
                        </div>
                      )}
                    </Link>

                    {viewMode === 'grid' && (
                      <div className={styles.entryInfo}>
                        <h3 className={`${styles.entryTitle} font-l`}>{entry.title}</h3>
                        <div className={styles.entryButtons}>
                          <FavoriteButton />
                          {entry.button && <p className="blur-back font-s">{entry.button}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <p className={`${styles.emptyText}`}>No content found :(</p>
            )}
          </div>

          <div className={`viewToggle blur-back`}>
            <button
              className={`viewToggleButton ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <GridIcon />
            </button>
            <button
              className={`viewToggleButton ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <ListIcon />
            </button>
          </div>

          {hoveredEntry && viewMode === 'list' && (
            <div className={styles.hoverPreview}>
              {hoveredEntry.featuredImage?.asset && (
                <div className={styles.hoverImageWrapper}>
                  <SanityImage
                    id={hoveredEntry.featuredImage.asset._id}
                    alt={hoveredEntry.featuredImage.alt || hoveredEntry.title}
                    className={styles.hoverImage}
                    width={600}
                    height={800}
                    mode="cover"
                  />
                  {hoveredEntry.excerpt && (
                    <div className={styles.hoverExcerpt}>
                      <p className="font-sm">{hoveredEntry.excerpt}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </FilterableContent>
  )
}
