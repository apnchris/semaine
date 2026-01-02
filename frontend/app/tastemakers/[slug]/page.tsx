import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {TASTEMAKER_QUERY} from '@/sanity/lib/queries'
import SanityImage from '@/app/components/SanityImage'

type Props = {
  params: Promise<{slug: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const {data: profile} = await sanityFetch({
    query: TASTEMAKER_QUERY,
    params: {slug},
  })

  return {
    title: profile?.name ? `${profile.name} - ${profile.title}` : 'Tastemaker',
    description: `${profile?.name} - ${profile?.title}`,
  }
}

export default async function TasteMakerPage({params}: Props) {
  const {slug} = await params
  const {data: profile} = await sanityFetch({
    query: TASTEMAKER_QUERY,
    params: {slug},
  })

  if (!profile) {
    notFound()
  }

  return (
    <article className="tastemaker-page">
      <header className="tastemaker-header">
        <h1>{profile.name}</h1>
        <h2>{profile.title}</h2>
      </header>

      {profile.picture && (
        <div className="tastemaker-image">
          <SanityImage
            id={profile.picture.asset._id}
            alt={profile.picture.alt || profile.name}
            width={800}
            height={800}
          />
        </div>
      )}
    </article>
  )
}
