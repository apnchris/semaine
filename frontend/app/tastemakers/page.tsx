import type {Metadata, ResolvingMetadata} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'
import TastemakersClient from './TastemakersClient'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

type Props = {
  params: Promise<{slug: string}>
}

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

const TASTEMAKERS_PAGE_QUERY = defineQuery(`
  *[_type == "tasteMakers" && _id == "tasteMakers"][0] {
    title,
    text,
    filters[]-> {
      _id,
      _type,
      slug,
      title
    },
    tasteMakersAndTasteBreakers[]-> {
      _id,
      _type,
      name,
      slug,
      title,
      filters[]->{
        _id
      },
      picture {
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
    query: TASTEMAKERS_PAGE_QUERY,
  })

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: pageData?.title || 'Taste Makers & Breakers',
    description: pageData?.text || 'Discover our taste makers and taste breakers',
    openGraph: {
      images: previousImages,
    },
  } satisfies Metadata
}

export default async function TasteMakersPage() {
  const {data: pageData} = await sanityFetch({
    query: TASTEMAKERS_PAGE_QUERY,
  })

  const allPeople = pageData?.tasteMakersAndTasteBreakers || []

  // Keep the original order from Sanity (as chosen in the studio)
  return <TastemakersClient pageData={pageData} sortedPeople={allPeople} />
}
