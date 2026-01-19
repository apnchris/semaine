import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {TASTEMAKER_QUERY} from '@/sanity/lib/queries'
import SanityImage from '@/app/components/SanityImage'
import styles from '@/app/css/pages/tastemaker.module.css'

type TasteMakerProfile = {
  _id: string
  _type: 'tasteMaker' | 'tasteBreaker'
  name: string
  title: string
  picture?: {
    asset: {
      _id: string
    }
    alt?: string
  }
}

type Props = {
  params: Promise<{slug: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const {data} = await sanityFetch({
    query: TASTEMAKER_QUERY,
    params: {slug},
  })
  
  const profile = data as TasteMakerProfile | null

  return {
    title: profile?.name ? `${profile.name} - ${profile.title}` : 'Tastemaker',
    description: `${profile?.name} - ${profile?.title}`,
  }
}

export default async function TasteMakerPage({params}: Props) {
  const {slug} = await params
  const {data} = await sanityFetch({
    query: TASTEMAKER_QUERY,
    params: {slug},
  })
  
  const profile = data as TasteMakerProfile | null

  if (!profile) {
    notFound()
  }

  return (
    <article className={`${styles.tastemakerPage}`}>
      <div className={`${styles.tastemakerCover}`}>
        <div className={`${styles.tastemakerHeader}`}>
          <div className={`${styles.tastemakerHeaderType}`}>
            <p className={`${styles.tastemakerHeaderTypeText} uppercase`}>
              Taste<br />Breaker
            </p>
          </div>

          <div>
            <h1 className={`${styles.tastemakerName}`}>{profile.name}</h1>
            <h2 className={`${styles.tastemakerTitle}`}>{profile.title}</h2>
          </div>
        </div>

        {profile.picture && (
          <div className={`${styles.tastemakerImage}`}>
            <SanityImage
              id={profile.picture.asset._id}
              alt={profile.picture.alt || profile.name}
              width={800}
              height={800}
            />
          </div>
        )}
      </div>
    </article>
  )
}
