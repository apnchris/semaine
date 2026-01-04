import type {Metadata, ResolvingMetadata} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'
import LearnClient from './LearnClient'

type Props = {
  params: Promise<{slug: string}>
}

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

const LEARN_PAGE_QUERY = defineQuery(`
  *[_type == "learn" && _id == "learn"][0] {
    title,
    text,
    filters[]-> {
      _id,
      _type,
      slug,
      title
    },
    entries[]-> {
      _id,
      _type,
      title,
      slug,
      button,
      filters[]->{
        _id
      },
      featuredImage {
        asset->{
          _id,
          url
        },
        alt
      }
    }
  }
`)

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const {data: pageData} = await sanityFetch({
    query: LEARN_PAGE_QUERY,
  })

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: pageData?.title || 'Learn',
    description: pageData?.text || 'Discover and learn',
    openGraph: {
      images: previousImages,
    },
  } satisfies Metadata
}

export default async function LearnPage() {
  const {data: pageData} = await sanityFetch({
    query: LEARN_PAGE_QUERY,
  })

  const allEntries = pageData?.entries || []

  // Keep the original order from Sanity (as chosen in the studio)
  return <LearnClient pageData={pageData} sortedEntries={allEntries} />
}
