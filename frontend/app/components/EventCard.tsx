import Link from 'next/link'
import SanityImage from '@/app/components/SanityImage'
import FavoriteButton from '@/app/components/FavoriteButton'
import styles from '../css/components/eventCard.module.css'

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

interface EventCardProps {
  event: Event
  viewMode: 'grid' | 'list'
  isNotHovered?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export default function EventCard({
  event,
  viewMode,
  isNotHovered,
  onMouseEnter,
  onMouseLeave,
}: EventCardProps) {
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
      <Link href={`/events/${event.slug.current}`} className={styles.eventLink}>
        <div
          className={styles.eventTitleWrapper}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className={styles.eventInfo}>
            <h3 className={`${styles.eventTitle} font-l`}>{event.title}</h3>
            <span className="font-l">
              {day}
              {endDate && ` – ${endDate}`} {month}, {formattedTime}h
            </span>
            {viewMode === 'grid' && event.excerpt && (
              <p className={`${styles.eventExcerpt} font-m`}>{event.excerpt}</p>
            )}
          </div>
        </div>
      </Link>

      {event.featuredImage?.asset && viewMode === 'grid' && (
        <div className={styles.eventImageWrapper}>
          <Link href={`/events/${event.slug.current}`} className={styles.eventLink}>
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
}
