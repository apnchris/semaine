import type {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'
import EventsClient from '@/app/events/EventsClient'

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

const EVENTS_QUERY = defineQuery(`
  *[_type == "event"] | order(dateTime asc) {
    _id,
    _type,
    title,
    slug,
    dateTime,
    dateTimeEnd,
    button,
    excerpt,
    featuredImage {
      asset->{
        _id,
        url
      },
      alt
    }
  }
`)

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming events and happenings',
}

export default async function EventsPage() {
  const {data: events} = await sanityFetch({
    query: EVENTS_QUERY,
  })

  return <EventsClient events={events || []} />
}
