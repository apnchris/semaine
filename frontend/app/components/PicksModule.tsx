import SanityImage from '@/app/components/SanityImage'
import Link from 'next/link'
import GuideCard from '@/app/components/GuideCard'
import styles from '../css/components/picksModule.module.css'

interface PickItem {
  items?: Array<{
    _id: string
    _type: 'product' | 'guide'
    slug: {
      current: string
    }
    title?: string
    store?: {
      title: string
    }
    featuredImage?: {
      asset: {
        _id: string
        url: string
      }
      alt?: string
    }
  }>
  message?: string
}

interface PicksModuleProps {
  title?: string
  picture?: {
    asset: {
      _id: string
      url: string
    }
    alt?: string
  }
  tasteMakerBreaker?: Array<{
    _id: string
    name: string
    slug: {
      current: string
    }
    _type: 'tasteMaker' | 'tasteBreaker'
  }>
  customCurator?: {
    from?: string
    curator?: string
  }
  links?: PickItem[]
}

export default function PicksModule({
  title,
  picture,
  tasteMakerBreaker,
  customCurator,
  links,
}: PicksModuleProps) {
  const curator = tasteMakerBreaker?.[0]
  const curatorPath = curator?._type === 'tasteMaker' ? 'tastemakers' : 'tastebreakers'

  return (
    <div className={styles.picksModule}>
      <div className={styles.picksHeader}>
        {picture?.asset && (
          <div className={styles.picksImageWrapper}>
            <SanityImage
              id={picture.asset._id}
              alt={picture.alt || title || 'Picks'}
              className={styles.picksImage}
              width={600}
              height={600}
              mode="cover"
            />
          </div>
        )}

        <div className={styles.picksInfo}>
          {title && <h2 className={`${styles.picksTitle} font-l`}>{title}</h2>}

          {curator && (
            <div className={styles.curator}>
              <p className="font-s">Curated by</p>
              <Link href={`/${curatorPath}/${curator.slug.current}`} className="font-m">
                {curator.name}
              </Link>
            </div>
          )}

          {customCurator && (
            <div className={styles.curator}>
              {customCurator.from && <p className="font-s">{customCurator.from}</p>}
              {customCurator.curator && <p className="font-m">{customCurator.curator}</p>}
            </div>
          )}
        </div>
      </div>

      {links && links.length > 0 && (
        <div className={styles.picksList}>
          {links.map((link, index) => {
            const item = link.items?.[0]
            if (!item) return null

            // Render GuideCard for guides
            if (item._type === 'guide') {
              return (
                <div key={index} className={styles.pickItem}>
                  <GuideCard guide={item as any} />
                  {link.message && (
                    <p className={`${styles.pickMessage} font-xs`}>{link.message}</p>
                  )}
                </div>
              )
            }

            // Render product items
            const itemPath = 'products'
            const itemTitle = item.title || item.store?.title || 'Item'

            return (
              <div key={index} className={styles.pickItem}>
                <Link href={`/${itemPath}/${item.slug.current}`} className={styles.pickLink}>
                  {item.featuredImage?.asset && (
                    <div className={styles.pickImageWrapper}>
                      <SanityImage
                        id={item.featuredImage.asset._id}
                        alt={item.featuredImage.alt || itemTitle}
                        className={styles.pickImage}
                        width={400}
                        height={400}
                        mode="cover"
                      />
                    </div>
                  )}
                  <h3 className={`${styles.pickTitle} font-s`}>{itemTitle}</h3>
                </Link>

                {link.message && (
                  <p className={`${styles.pickMessage} font-xs`}>{link.message}</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
