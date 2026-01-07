import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'
import AddToCart from '@/app/components/AddToCart'
import SanityImage from '@/app/components/SanityImage'

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
  
  // Debug logging
  console.log('Variants data:', JSON.stringify(sanityProduct.store.variants, null, 2))
  
  return (
    <article className="product-page">
      
      {/* Product Images from Shopify */}
      {sanityProduct.store.images && sanityProduct.store.images.length > 0 && (
        <div className="product-images">
          {sanityProduct.store.images.map((image: any, index: number) => (
            <div key={image.id || index} className="product-image">
              <img
                src={image.url || image.src}
                alt={image.altText || sanityProduct.store.title}
                width={image.width || 800}
                height={image.height || 800}
              />
            </div>
          ))}
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

      {/* Shopify Metafields */}
      {sanityProduct.store.metafields && (
        <div className="product-metafields">
          {sanityProduct.store.metafields.details_column_01 && (
            <div className="metafield-details">
              <h3>Details:</h3>
              <pre style={{whiteSpace: 'pre-wrap'}}>{sanityProduct.store.metafields.details_column_01}</pre>
            </div>
          )}
          {sanityProduct.store.metafields.details_column_02 && (
            <div className="metafield-details">
              <h3>Additional Info:</h3>
              <pre style={{whiteSpace: 'pre-wrap'}}>{sanityProduct.store.metafields.details_column_02}</pre>
            </div>
          )}
        </div>
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
          variants={sanityProduct.store.variants
            .filter((v: any) => v && v.store)
            .map((v: any) => ({
              id: v.store.gid,
              title: v.store.title,
              price: v.store.price,
              compareAtPrice: v.store.compareAtPrice,
              sku: v.store.sku,
              availableForSale: v.store.inventory?.isAvailable !== false,
            }))}
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
    </article>
  )
}