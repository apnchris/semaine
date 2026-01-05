'use client'

import {useState} from 'react'
import styles from '../css/pages/events.module.css'
import {GridIcon, ListIcon} from '@/app/components/Vectors'
import EventCard from '@/app/components/EventCard'

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
              const isNotHovered = hoveredEvent ? hoveredEvent._id !== event._id : false

              return (
                <EventCard
                  key={event._id}
                  event={event}
                  viewMode={viewMode}
                  isNotHovered={isNotHovered}
                  onMouseEnter={() => setHoveredEvent(event)}
                  onMouseLeave={() => setHoveredEvent(null)}
                />
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
    </div>
  )
}
