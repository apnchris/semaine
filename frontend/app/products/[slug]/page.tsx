import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {getProduct} from '@/lib/shopify'
import {defineQuery} from 'next-sanity'
import SanityImage from '@/app/components/SanityImage'

type Props = {
  params: Promise<{slug: string}>
}

const PRODUCT_QUERY = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    shopifyId,
    handle,
    title,
    description,
    featuredImage {
      asset->{
        _id,
        url
      },
      alt
    },
    tasteMakers[]->{name, slug}
  }
`)

export default async function ProductPage({params}: Props) {
  const {slug} = await params
  
  // Get Sanity content
  const {data: sanityProduct} = await sanityFetch({
    query: PRODUCT_QUERY,
    params: {slug},
  })
  
  if (!sanityProduct) notFound()
  
  // Get live Shopify data
  const shopifyProduct = await getProduct(sanityProduct.handle)
  
  return (
    <article className="product-page">
      {/* Featured Image */}
      {sanityProduct.featuredImage ? (
        <div className="product-image">
          <SanityImage
            id={sanityProduct.featuredImage.asset._id}
            alt={sanityProduct.featuredImage.alt || sanityProduct.title || shopifyProduct.title}
            width={800}
            height={800}
          />
        </div>
      ) : shopifyProduct.images?.edges?.[0]?.node ? (
        <div className="product-image">
          <img
            src={shopifyProduct.images.edges[0].node.url}
            alt={shopifyProduct.images.edges[0].node.altText || shopifyProduct.title}
            width={800}
            height={800}
          />
        </div>
      ) : null}

      <h1>{sanityProduct.title || shopifyProduct.title}</h1>
      
      {sanityProduct.description && (
        <div className="product-description">
          {/* You can render portable text here if needed */}
          <p>{sanityProduct.description}</p>
        </div>
      )}
      
      {shopifyProduct.descriptionHtml && (
        <div 
          className="shopify-description" 
          dangerouslySetInnerHTML={{__html: shopifyProduct.descriptionHtml}}
        />
      )}

      {/* Price */}
      {shopifyProduct.priceRange && (
        <div className="product-price">
          <span className="price">
            {shopifyProduct.priceRange.minVariantPrice.currencyCode}{' '}
            {shopifyProduct.priceRange.minVariantPrice.amount}
          </span>
        </div>
      )}

      {/* Tastemakers */}
      {sanityProduct.tasteMakers && sanityProduct.tasteMakers.length > 0 && (
        <div className="product-tastemakers">
          <h3>Recommended by:</h3>
          <ul>
            {sanityProduct.tasteMakers.map((tm: any) => (
              <li key={tm.slug.current}>
                <a href={`/tastemakers/${tm.slug.current}`}>{tm.name}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}