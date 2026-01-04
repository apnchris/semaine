import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

type Props = {
  params: Promise<{slug: string}>
}

const LEARN_ENTRY_QUERY = defineQuery(`
  *[_type == "learnEntry" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    button,
    featuredImage {
      asset->{
        _id,
        url
      },
      alt
    },
    filters[]-> {
      _id,
      title
    }
  }
`)

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params
  const {data: entry} = await sanityFetch({
    query: LEARN_ENTRY_QUERY,
    params,
  })

  const previousImages = (await parent).openGraph?.images || []
  const ogImage = resolveOpenGraphImage(entry?.featuredImage)

  return {
    title: entry?.title,
    description: entry?.button || 'Learn more',
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata
}

export default async function LearnEntryPage(props: Props) {
  const params = await props.params
  const {data: entry} = await sanityFetch({
    query: LEARN_ENTRY_QUERY,
    params,
  })

  if (!entry) {
    return notFound()
  }

  return (
    <div className="main-grid">
      <div className="content-wrapper">
        <h1 className="font-xl">{entry.title}</h1>
        {entry.button && <p className="font-l">{entry.button}</p>}
        {/* Add more content rendering here as needed */}
      </div>
    </div>
  )
}
