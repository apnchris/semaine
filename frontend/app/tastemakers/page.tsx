import Link from 'next/link'
import {sanityFetch} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'
import SanityImage from '@/app/components/SanityImage'
import styles from '../css/pages/tastemakers.module.css'

interface Person {
  _id: string
  _type: 'tasteMaker' | 'tasteBreaker'
  name: string
  slug: {
    current: string
  }
  title?: string
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
    tasteMakersAndTasteBreakers[]-> {
      _id,
      _type,
      name,
      slug,
      title,
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

export default async function TasteMakersPage() {
  const {data: pageData} = await sanityFetch({
    query: TASTEMAKERS_PAGE_QUERY,
  })

  const allPeople = pageData?.tasteMakersAndTasteBreakers || []

  // Sort alphabetically by name
  const sortedPeople = allPeople.length > 0
    ? [...allPeople].sort((a: Person, b: Person) => a.name.localeCompare(b.name))
    : []

  return (
    <div>
      <div className={`${styles.introFilters} main-grid`}>
        <div className={styles.filters}>
          Filter
          {/* Placeholder for future filters */}
        </div>

        <div className={styles.intro}>
          <h1 className="font-l">{pageData?.title || 'Taste Makers & Breakers'}</h1>
          {pageData?.text && <p className="font-m">{pageData.text}</p>}
        </div>
      </div>

      <div className={styles.profileGrid}>
        {allPeople.length > 0 ? (
          allPeople.map((person: Person) => {
            const basePath = person._type === 'tasteMaker' ? 'tastemakers' : 'tastebreakers'
            const label = person._type === 'tasteMaker' ? 'Taste Maker' : 'Taste Breaker'
            const cardClass = person._type === 'tasteMaker' ? styles.tastemakerCard : styles.tastebreakerCard
            
            return (
              <Link
                key={person._id}
                href={`/${basePath}/${person.slug.current}`}
                className={`${styles.profileCard} ${cardClass || ''}`}
              >
                {person.picture?.asset && (
                  <div className={styles.profileImageWrapper}>
                    <SanityImage
                      id={person.picture.asset._id}
                      alt={person.picture.alt || person.name}
                      className={styles.profileImage}
                      width={475}
                      height={600}
                      mode="cover"
                    />
                  </div>
                )}
                
                <div className={styles.profileInfo}>
                  <h3 className='font-m'>{person.name}</h3>
                  {person.title && (
                    <p className='font-s'>
                      {person.title}
                    </p>
                  )}
                </div>
              </Link>
            )
          })
        ) : (
          <p>No taste makers or breakers found.</p>
        )}
      </div>
    </div>
  )
}
