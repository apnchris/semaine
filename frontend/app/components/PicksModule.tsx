'use client'

import {useEffect, useRef} from 'react'
import SanityImage from '@/app/components/SanityImage'
import Link from 'next/link'
import GuideCard from '@/app/components/GuideCard'
import ProductCard from '@/app/components/ProductCard'
import styles from '../css/components/picksModule.module.css'
import Swiper from 'swiper'
import { Navigation, Pagination } from 'swiper/modules';
import { ArrowIcon } from '@/app/components/Vectors';
import 'swiper/css'
import 'swiper/css/pagination';

interface PickItem {
  items?: Array<{
    _id: string
    _type: 'product' | 'guide'
    slug: {
      current: string
    }
    title?: string
    address?: string
    message?: string
    location?: Array<{
      _id: string
      city?: string
      country?: string
    }>
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
  moduleKey?: string
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
    title: string
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
  moduleKey,
  title,
  picture,
  tasteMakerBreaker,
  customCurator,
  links,
}: PicksModuleProps) {
  const curator = tasteMakerBreaker?.[0]
  const curatorPath = curator?._type === 'tasteMaker' ? 'tastemakers' : 'tastebreakers'
  const swiperRef = useRef<Swiper | null>(null)

  useEffect(() => {
    if (!swiperRef.current) {
      swiperRef.current = new Swiper('.swiper', {
        modules: [Navigation, Pagination],
        loop: true,
        slidesPerView: 2,
        spaceBetween: 10,
        centeredSlides: true,
        navigation: {
          nextEl: '.swipe-next',
          prevEl: '.swipe-prev',
        },
        pagination: {
          el: '.picks-pagination',
          type: 'bullets',
          dynamicBullets: true,
          dynamicMainBullets: 3,
          clickable: true
        },
      })
    }

    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy()
        swiperRef.current = null
      }
    }
  }, [])

  return (
    <div className={`${styles.picksModule} picks-module`}>
      <div className={styles.picksCover}>
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

        {title && <h2 className={`${styles.picksTitle} uppercase font-l`}>{title}</h2>}

        {curator && (
          <div className={styles.curator}>
            <p className="font-l uppercase" dangerouslySetInnerHTML={{ __html: curator._type === 'tasteMaker' ? 'Taste<br>maker' : 'Taste<br>breaker' }} />
            <p className="font-l">{curator.name}<br />{curator.title}</p>
          </div>
        )}

        {customCurator && (
          <div className={styles.curator}>
            {customCurator.from && <p className="font-l uppercase">{customCurator.from}</p>}
            {customCurator.curator && <p className="font-l">{customCurator.curator}</p>}
          </div>
        )}
      </div>

      {links && links.length > 0 && (
        <div className={styles.picksWrapper}>
          <div className={`swiper ${styles.picksSwiper}`}>
            <div className={`swiper-wrapper ${styles.picksSwiperWrapper}`}>
              {links.map((link, index) => {
                const item = link.items?.[0]
                if (!item) return null

                // Render GuideCard for guides
                if (item._type === 'guide') {
                  return (
                    <div key={`${moduleKey || 'picks'}-${item._id}-${index}`} className={`swiper-slide ${styles.pickItem}`}>
                      <GuideCard guide={item as any} />
                      {link.message && (
                        <p className={`${styles.pickMessage} font-xs`}>{link.message}</p>
                      )}
                    </div>
                  )
                }

                // Render product items
                if (item._type === 'product') {
                  return (
                    <div key={`${moduleKey || 'picks'}-${item._id}-${index}`} className={`swiper-slide ${styles.pickItem}`}>
                      <ProductCard product={item as any} />
                      {link.message && (
                        <p className={`${styles.pickMessage} font-xs`}>{link.message}</p>
                      )}
                    </div>
                  )
                }

                return null
              })}
            </div>

            <div className={`swiper-bar ${styles.swiperBar}`}>
              <div className={`swipe-prev ${styles.swipePrev}`}>
                <ArrowIcon />
              </div>
              
              <div className={`${styles.picksPaginationWrapper}`}>
                <div className={`picks-pagination ${styles.picksPagination}`}></div>
              </div>

              <div className={`swipe-next ${styles.swipeNext}`}>
                <ArrowIcon />
              </div>
            </div>
          </div>

          <div className={`uppercase font-l ${styles.picksLabel}`}>Picks</div>
        </div>
      )}
    </div>
  )
}
