'use client'

import {useState} from 'react'
import Link from 'next/link'
import SanityImage from '@/app/components/SanityImage'
import styles from '../css/pages/events.module.css'
import {GridIcon, ListIcon} from '@/app/components/Vectors'
import FavoriteButton from '@/app/components/FavoriteButton'

interface Event {
  _id: string
  _type: 'event'
  title: string
  slug: {
    current: string
  }
  dateTime: string
  dateTimeEnd?: string
  button?: string
  excerpt?: string
  featuredImage?: {
    asset: {
      _id: string
      url: string
    }
    alt?: string
  }
}

interface EventsClientProps {
  events: Event[]
}

interface GroupedEvents {
  [key: string]: Event[]
}

export default function EventsClient({events}: EventsClientProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null)

  // Group events by month
  const groupedEvents = events.reduce<GroupedEvents>((acc, event) => {
    const date = new Date(event.dateTime)
    const monthYear = date.toLocaleDateString('en-US', {
      month: 'long',
    })
    
    if (!acc[monthYear]) {
      acc[monthYear] = []
    }
    acc[monthYear].push(event)
    return acc
  }, {})

  return (
    <div>
      <div className={`${styles.introSection} main-grid`}>
        <div className={styles.intro}>
          <h1 className="font-l">Event</h1>
        </div>
      </div>

      {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
        <div key={monthYear} className={styles.monthSection}>
          <h2 className={`${styles.monthTitle} font-m`}>{monthYear}</h2>

          <div className={`${styles.eventsGrid} ${viewMode === 'list' ? styles.listView : ''}`}>
            {monthEvents.map((event: Event) => {
              const isNotHovered = hoveredEvent && hoveredEvent._id !== event._id
              const eventDate = new Date(event.dateTime)
              const day = eventDate.getDate()
              const month = eventDate.toLocaleDateString('en-US', {
                month: 'short',
              })
              const formattedTime = eventDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                hour12: false,
              })
              
              const endDate = event.dateTimeEnd 
                ? new Date(event.dateTimeEnd).toLocaleDateString('en-US', {
                    day: 'numeric',
                  })
                : null

              return (
                <div className={`${styles.eventCard} ${isNotHovered ? styles.notHovered : ''}`}>
                  <Link
                    key={event._id}
                    href={`/events/${event.slug.current}`}
                    className={`${styles.eventLink}`}
                  >
                    <div
                      className={styles.eventTitleWrapper}
                      onMouseEnter={() => setHoveredEvent(event)}
                      onMouseLeave={() => setHoveredEvent(null)}
                    >
                      <div className={styles.eventInfo}>
                        <h3 className={`${styles.eventTitle} font-l`}>{event.title}</h3>
                        <span className="font-l">
                          {day}{endDate && ` – ${endDate}`} {month}, {formattedTime}h
                        </span>
                        {viewMode === 'grid' && event.excerpt && (
                          <p className={`${styles.eventExcerpt} font-m`}>{event.excerpt}</p>
                        )}
                      </div>
                    </div>
                  </Link>

                  {event.featuredImage?.asset && viewMode === 'grid' && (
                    <div className={styles.eventImageWrapper}>
                      <Link
                        key={event._id}
                        href={`/events/${event.slug.current}`}
                        className={`${styles.eventLink}`}
                      >
                        <SanityImage
                          id={event.featuredImage.asset._id}
                          alt={event.featuredImage.alt || event.title}
                          className={styles.eventImage}
                          width={945}
                          height={590}
                          mode="cover"
                        />
                      </Link>

                      {viewMode === 'grid' && (
                        <div className={styles.eventButtons}>
                          <FavoriteButton />
                          {event.button && <p className="blur-back font-s">{event.button}</p>}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {events.length === 0 && (
        <p className={styles.emptyText}>No events found :(</p>
      )}

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

      {/* {hoveredEvent && viewMode === 'list' && (
        <div className={styles.hoverPreview}>
          {hoveredEvent.featuredImage?.asset && (
            <div className={styles.hoverImageWrapper}>
              <SanityImage
                id={hoveredEvent.featuredImage.asset._id}
                alt={hoveredEvent.featuredImage.alt || hoveredEvent.title}
                className={styles.hoverImage}
                width={600}
                height={800}
                mode="cover"
              />
              {hoveredEvent.excerpt && (
                <div className={styles.hoverExcerpt}>
                  <p className="font-sm">{hoveredEvent.excerpt}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )} */}
    </div>
  )
}
