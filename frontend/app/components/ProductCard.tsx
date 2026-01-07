import Link from 'next/link'

interface ProductCardProps {
  product: {
    _id: string
    store: {
      slug: {
        current: string
      }
      title: string
      previewImageUrl?: string
      priceRange?: {
        minVariantPrice?: number
        maxVariantPrice?: number
      }
      vendor?: string
      productType?: string
    }
  }
}

export default function ProductCard({product}: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.store.slug.current}`}
      className="product-card"
    >
      {/* Product Image */}
      {product.store.previewImageUrl && (
        <div>
          <img
            src={product.store.previewImageUrl}
            alt={product.store.title}
          />
        </div>
      )}

      {/* Product Info */}
      <div>
        <h2>
          {product.store.title}
        </h2>

        {/* Vendor */}
        {product.store.vendor && (
          <div>
            {product.store.vendor}
          </div>
        )}

        {/* Price */}
        {product.store.priceRange?.minVariantPrice && (
          <div>
            EUR {product.store.priceRange.minVariantPrice}
            {product.store.priceRange.maxVariantPrice &&
              product.store.priceRange.maxVariantPrice !==
                product.store.priceRange.minVariantPrice && (
                <span>EUR {product.store.priceRange.maxVariantPrice}</span>
              )}
          </div>
        )}

        {/* Product Type */}
        {product.store.productType && (
          <div>
            {product.store.productType}
          </div>
        )}
      </div>
    </Link>
  )
}
