import Link from 'next/link'
import {sanityFetch} from '@/sanity/lib/live'
import {allProductsQuery} from '@/sanity/lib/queries'

export default async function ProductsPage() {
  const {data: products} = await sanityFetch({
    query: allProductsQuery,
  })

  if (!products || products.length === 0) {
    return (
      <div className="products-page">
        <h1>Products</h1>
        <p>No products found.</p>
      </div>
    )
  }

  return (
    <div className="products-page">
      <h1>All Products</h1>
      <div className="products-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '2rem',
        padding: '2rem 0',
      }}>
        {products.map((product: any) => (
          <Link
            key={product._id}
            href={`/products/${product.store.slug.current}`}
            className="product-card"
            style={{
              display: 'block',
              textDecoration: 'none',
              color: 'inherit',
              border: '1px solid #eee',
              borderRadius: '8px',
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            {/* Product Image */}
            {product.store.previewImageUrl && (
              <div style={{
                position: 'relative',
                paddingTop: '100%',
                backgroundColor: '#f5f5f5',
              }}>
                <img
                  src={product.store.previewImageUrl}
                  alt={product.store.title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            )}

            {/* Product Info */}
            <div style={{padding: '1rem'}}>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                lineHeight: '1.4',
              }}>
                {product.store.title}
              </h2>

              {/* Price */}
              {product.store.priceRange && (
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                }}>
                  {product.store.priceRange.minVariantPrice.currencyCode}{' '}
                  {product.store.priceRange.minVariantPrice.amount}
                  {product.store.priceRange.maxVariantPrice.amount !== 
                   product.store.priceRange.minVariantPrice.amount && (
                    <span> - {product.store.priceRange.maxVariantPrice.amount}</span>
                  )}
                </div>
              )}

              {/* Vendor */}
              {product.store.vendor && (
                <div style={{
                  fontSize: '0.875rem',
                  color: '#666',
                  marginBottom: '0.25rem',
                }}>
                  {product.store.vendor}
                </div>
              )}

              {/* Product Type */}
              {product.store.productType && (
                <div style={{
                  fontSize: '0.75rem',
                  color: '#999',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  {product.store.productType}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
