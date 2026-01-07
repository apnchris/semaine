import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'
import AddToCart from '@/app/components/AddToCart'

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
    body,
    store {
      id,
      title,
      slug,
      status,
      isDeleted,
      previewImageUrl,
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
    <article className="product-page">
      {/* Featured Image from Shopify */}
      {sanityProduct.store.previewImageUrl && (
        <div className="product-image">
          <img
            src={sanityProduct.store.previewImageUrl}
            alt={sanityProduct.store.title}
            width={800}
            height={800}
          />
        </div>
      )}

      <h1>{sanityProduct.store.title}</h1>
      
      {/* Editorial Content from Sanity */}
      {sanityProduct.body && (
        <div className="product-description">
          {/* You can render portable text here with a PortableText component */}
          <p>Editorial content available</p>
        </div>
      )}
      
      {/* Shopify Description */}
      {sanityProduct.store.descriptionHtml && (
        <div 
          className="shopify-description" 
          dangerouslySetInnerHTML={{__html: sanityProduct.store.descriptionHtml}}
        />
      )}

      {/* Price Range */}
      {sanityProduct.store.priceRange?.minVariantPrice && (
        <div className="product-price">
          <span className="price">
            {sanityProduct.store.priceRange.minVariantPrice.currencyCode ?? 'USD'}{' '}
            {sanityProduct.store.priceRange.minVariantPrice.amount}
          </span>
        </div>
      )}

      {/* Product Details */}
      <div className="product-details">
        {sanityProduct.store.vendor && (
          <p><strong>Vendor:</strong> {sanityProduct.store.vendor}</p>
        )}
        {sanityProduct.store.productType && (
          <p><strong>Type:</strong> {sanityProduct.store.productType}</p>
        )}
        {sanityProduct.store.tags && sanityProduct.store.tags.length > 0 && (
          <p><strong>Tags:</strong> {sanityProduct.store.tags.join(', ')}</p>
        )}
      </div>

      {/* Add to Cart */}
      {sanityProduct.store.variants && sanityProduct.store.variants.length > 0 && (
        <AddToCart 
          variants={sanityProduct.store.variants}
          productTitle={sanityProduct.store.title}
        />
      )}

      {/* Options */}
      {sanityProduct.store.options && sanityProduct.store.options.length > 0 && (
        <div className="product-options">
          <h3>Options:</h3>
          {sanityProduct.store.options.map((option: any) => (
            <div key={option.name}>
              <strong>{option.name}:</strong> {option.values.join(', ')}
            </div>
          ))}
        </div>
      )}

      {/* Color Theme */}
      {sanityProduct.colorTheme && (
        <div className="product-color-theme">
          <p><strong>Color Theme:</strong> {sanityProduct.colorTheme.title}</p>
        </div>
      )}

      {/* SEO */}
      {sanityProduct.seo && (
        <div className="product-seo" style={{display: 'none'}}>
          <p>SEO configured</p>
        </div>
      )}
    </article>
  )
}