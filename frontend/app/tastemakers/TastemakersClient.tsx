'use client'

import {useState} from 'react'
import Link from 'next/link'
import SanityImage from '@/app/components/SanityImage'
import FilterableContent from '@/app/components/FilterableList'
import styles from '../css/pages/tastemakers.module.css'
import {GridIcon, ListIcon} from '@/app/components/Vectors'
import FavoriteButton from '@/app/components/FavoriteButton'

interface Person {
  _id: string
  _type: 'tasteMaker' | 'tasteBreaker'
  name: string
  slug: {
    current: string
  }
  title?: string
  excerpt?: string
  filters?: Array<{_id: string}>
  picture?: {
    asset: {
      _id: string
      url: string
    }
    alt?: string
  }
  signature?: {
    asset: {
      _id: string
      url: string
    }
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [hoveredPerson, setHoveredPerson] = useState<Person | null>(null)

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

          <div className={`${styles.profileGrid} ${viewMode === 'list' ? styles.listView : ''}`}>
            {filteredItems.length > 0 ? (
              filteredItems.map((person: Person) => {
                const basePath = person._type === 'tasteMaker' ? 'tastemakers' : 'tastebreakers'
                const cardClass =
                  person._type === 'tasteMaker' ? styles.tastemakerCard : styles.tastebreakerCard

                return (
                  <div className={`${styles.profileCard} ${cardClass || ''}`}>
                    {viewMode === 'grid' && (
                      <FavoriteButton className={styles.favoriteButton} />
                    )}
                    
                    <Link
                      key={person._id}
                      href={`/${basePath}/${person.slug.current}`}
                      className={`${styles.profileCardLink}`}
                    >
                      {person.picture?.asset && viewMode === 'grid' && (
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

                      {person.signature?.asset && viewMode === 'list' && (
                        <div 
                          className={styles.profileSignatureWrapper}
                          onMouseEnter={() => setHoveredPerson(person)}
                          onMouseLeave={() => setHoveredPerson(null)}
                        >
                          <SanityImage
                            id={person.signature.asset._id}
                            alt={person.name}
                            className={styles.profileSignature}
                            width={475}
                            mode="contain"
                          />
                        </div>
                      )}

                      {viewMode === 'grid' && (
                        <div className={styles.profileInfo}>
                          <h3 className="font-m">{person.name}</h3>
                          {person.title && <p className="font-s">{person.title}</p>}
                        </div>
                      )}
                    </Link>
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

          {hoveredPerson && viewMode === 'list' && (
            <div className={styles.hoverPreview}>
              {hoveredPerson.picture?.asset && (
                <div className={styles.hoverImageWrapper}>
                  <SanityImage
                    id={hoveredPerson.picture.asset._id}
                    alt={hoveredPerson.picture.alt || hoveredPerson.name}
                    className={styles.hoverImage}
                    width={600}
                    height={800}
                    mode="cover"
                  />
                  {hoveredPerson.excerpt && (
                    <div className={styles.hoverExcerpt}>
                      <p className="font-sm">{hoveredPerson.excerpt}</p>
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
