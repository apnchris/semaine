import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {TASTEBREAKER_QUERY} from '@/sanity/lib/queries'
import SanityImage from '@/app/components/SanityImage'

type Props = {
  params: Promise<{slug: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const {data: profile} = await sanityFetch({
    query: TASTEBREAKER_QUERY,
    params: {slug},
  })

  return {
    title: profile?.name ? `${profile.name} - ${profile.title}` : 'Tastebreaker',
    description: `${profile?.name} - ${profile?.title}`,
  }
}

export default async function TasteBreakerPage({params}: Props) {
  const {slug} = await params
  const {data: profile} = await sanityFetch({
    query: TASTEBREAKER_QUERY,
    params: {slug},
  })

  if (!profile) {
    notFound()
  }

  return (
    <article className="tastebreaker-page">
      <header className="tastebreaker-header">
        <h1>{profile.name}</h1>
        <h2>{profile.title}</h2>
      </header>

      {profile.picture && (
        <div className="tastebreaker-image">
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
