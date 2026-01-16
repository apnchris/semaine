'use client'

import {useEffect, useRef} from 'react'
import ProductCard from '@/app/components/ProductCard'
import styles from '../css/components/relatedProducts.module.css'
import Swiper from 'swiper'
import {Navigation, Pagination} from 'swiper/modules'
import {ArrowIcon} from '@/app/components/Vectors'
import 'swiper/css'
import 'swiper/css/pagination'

interface RelatedProductsProps {
  module: {
    _key?: string
    title?: string
    products?: Array<{
      _id: string
      _type: 'product'
      thumbSize?: boolean
      colorTheme?: {
        title?: string
        text?: string
        background?: string
      }
      store: {
        id?: string
        title: string
        slug: {
          current: string
        }
        status?: string
        previewImageUrl?: string
        priceRange?: {
          minVariantPrice?: number
          maxVariantPrice?: number
        }
        productType?: string
        vendor?: string
        tags?: string[]
      }
      seo?: {
        title?: string
        description?: string
      }
    }>
  }
}

export default function RelatedProducts({module}: RelatedProductsProps) {
  const swiperRef = useRef<Swiper | null>(null)

  useEffect(() => {
    if (!swiperRef.current) {
      swiperRef.current = new Swiper('.related-products-swiper', {
        modules: [Navigation, Pagination],
        loop: true,
        slidesPerView: 2,
        spaceBetween: 10,
        centeredSlides: true,
        navigation: {
          nextEl: '.related-swipe-next',
          prevEl: '.related-swipe-prev',
        },
        pagination: {
          el: '.related-products-pagination',
          type: 'bullets',
          dynamicBullets: true,
          dynamicMainBullets: 3,
          clickable: true,
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

  if (!module.products || module.products.length === 0) {
    return null
  }

  return (
    <div className={styles.relatedProducts}>
      {module.title && <h2 className={`${styles.title} font-l`}>{module.title}</h2>}

      <div className={`related-products-swiper ${styles.swiper}`}>
        <div className={`swiper-wrapper ${styles.swiperWrapper}`}>
          {module.products.map((product, index) => (
            <div
              key={`${module._key}-${product._id}-${index}`}
              className={`swiper-slide ${styles.slide}`}
            >
              <ProductCard product={{...product, thumbSize: false}} />
            </div>
          ))}
        </div>

        <div className={`swiper-bar ${styles.swiperBar}`}>
          <div className={`related-swipe-prev ${styles.swipePrev}`}>
            <ArrowIcon />
          </div>

          <div className={styles.paginationWrapper}>
            <div className={`related-products-pagination ${styles.pagination}`}></div>
          </div>

          <div className={`related-swipe-next ${styles.swipeNext}`}>
            <ArrowIcon />
          </div>
        </div>
      </div>
    </div>
  )
}
