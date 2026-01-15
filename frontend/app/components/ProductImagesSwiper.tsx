'use client'

import {useEffect, useRef} from 'react'
import Swiper from 'swiper'
import {Navigation, Pagination, Mousewheel} from 'swiper/modules'
import {ArrowIcon} from '@/app/components/Vectors'
import 'swiper/css'
import 'swiper/css/pagination'
import styles from '../css/components/productSwiper.module.css'

type ImageType = {
  id?: string
  url?: string
  src?: string
  altText?: string
  width?: number
  height?: number
}

type Props = {
  images: ImageType[]
  productTitle: string
}

export default function ProductImagesSwiper({images, productTitle}: Props) {
  const swiperRef = useRef<Swiper | null>(null)

  useEffect(() => {
    if (!swiperRef.current) {
      swiperRef.current = new Swiper('.product-swiper', {
        modules: [Navigation, Pagination, Mousewheel],
        direction: 'vertical',
        loop: false,
        slidesPerView: 1,
        spaceBetween: 0,
        navigation: {
          nextEl: '.product-swipe-next',
        },
        mousewheel: {
          enabled: true,
          forceToAxis: false,
          releaseOnEdges: true,
        },
        pagination: {
          el: '.product-pagination',
          type: 'bullets',
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
  }, [images.length])

  return (
    <div className={`${styles.productImages}`}>
      <div className={`${styles.productSwiper} product-swiper`}>
        <div className="swiper-wrapper">
          {images.map((image: ImageType, index: number) => (
            <div key={image.id || index} className="swiper-slide">
              <img
                src={image.url || image.src}
                alt={image.altText || productTitle}
                width={image.width || 800}
                height={image.height || 800}
                className={styles.productImage}
              />
            </div>
          ))}
        </div>

        <div className="product-pagination-wrapper">
          <div className="product-pagination"></div>
        </div>

        <div className={`${styles.productSwipeNext} product-swipe-next`}>
          <ArrowIcon />
        </div>
      </div>
    </div>
  )
}
