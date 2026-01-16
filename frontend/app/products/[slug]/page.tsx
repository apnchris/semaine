import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'
import ProductModule from '@/app/components/ProductModule'
import HideFooter from '@/app/components/HideFooter'

type Props = {
  params: Promise<{slug: string}>
}

const PRODUCT_QUERY = defineQuery(`
  *[_type == "product" && store.slug.current == $slug][0] {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    colorTheme->{
      title,
      text,
      background
    },
    body[]{
      ...,
    },
    modules[]{
      _key,
      _type,
      title,
      products[]->{        _id,
        _type,
        thumbSize,
        colorTheme->{
          title,
          text,
          background
        },
        store {
          id,
          title,
          slug,
          status,
          previewImageUrl,
          priceRange {
            minVariantPrice,
            maxVariantPrice
          },
          productType,
          vendor,
          tags
        },
        seo {
          title,
          description
        }
      }
    },
    store {
      id,
      title,
      slug,
      status,
      isDeleted,
      previewImageUrl,
      images,
      metafields,
      priceRange,
      descriptionHtml,
      options,
      variants[]->{
        _id,
        store {
          id,
          gid,
          title,
          price,
          compareAtPrice,
          sku,
          inventory {
            isAvailable,
            management,
            policy
          }
        }
      },
      productType,
      tags,
      vendor
    },
    seo {
      title,
      description,
      image
    },
    "shopPage": *[_type == "shopPage"][0] {
      shipping,
      returns,
      payment
    }
  }
`)

export default async function ProductPage({params}: Props) {
  const {slug} = await params
  
  // Get Sanity product with all data
  const {data: sanityProduct} = await sanityFetch({
    query: PRODUCT_QUERY,
    params: {slug},
  })
  
  if (!sanityProduct || !sanityProduct.store) notFound()
    
  return (
    <>
      <HideFooter pageType="product" />
      <div className="product-page">
        <ProductModule 
          product={sanityProduct}
          showTerms={true}
          showEditorialContent={true}
        />
      </div>
    </>
  )
}