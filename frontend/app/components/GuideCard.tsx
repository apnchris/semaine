import Link from 'next/link'
import SanityImage from '@/app/components/SanityImage'
import FavoriteButton from '@/app/components/FavoriteButton'
import styles from '../css/components/guideCard.module.css'

interface Guide {
  _id: string
  _type: 'guide'
  title: string
  slug: {
    current: string
  }
  address?: string
  message?: string
  location?: Array<{
    _id: string
    city?: string
    country?: string
  }>
  featuredImage?: {
    asset: {
      _id: string
      url: string
    }
    alt?: string
  }
}

interface GuideCardProps {
  guide: Guide
}

export default function GuideCard({guide}: GuideCardProps) {
  return (
    <div className={styles.guideCard}>
      <Link href={`/guide/${guide.slug.current}`} className={styles.guideLink}>
        {guide.featuredImage?.asset && (
          <div className={styles.guideImageWrapper}>
            <SanityImage
              id={guide.featuredImage.asset._id}
              alt={guide.featuredImage.alt || guide.title}
              className={styles.guideImage}
              width={350}
              height={445}
              mode="cover"
            />
          </div>
        )}

        <div className={styles.guideMessage}>
          {guide.message && <p className="serif font-sm">{guide.message}</p>}
        </div>

        <div className={styles.guideInfo}>
          <h3 className={`${styles.guideTitle} font-s`}>{guide.title}</h3>
          <div className={styles.guideLocationWrapper}>
            {guide.location && guide.location.length > 0 && (
              <p className={`${styles.guideLocation} font-xs`}>
                {guide.location
                  .filter((loc) => loc.city || loc.country)
                  .map((loc) => [loc.city, loc.country].filter(Boolean).join(', '))
                  .join(' • ')}
              </p>
            )}
            {guide.address && <p className={`${styles.guideAddress} font-xs`}>{guide.address}</p>}
          </div>
        </div>
      </Link>

      <div className={styles.guideButtons}>
        <FavoriteButton />
      </div>
    </div>
  )
}
