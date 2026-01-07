import {sanityFetch} from '@/sanity/lib/live'
import {allProductsQuery} from '@/sanity/lib/queries'
import ProductCard from '@/app/components/ProductCard'

export default async function ProductsPage() {
  const {data: products} = await sanityFetch({
    query: allProductsQuery,
  })

  if (!products || products.length === 0) {
    return (
      <div className="products-page">
        <p>No products found.</p>
      </div>
    )
  }

  return (
    <div className="products-page">
      <div>
        {products.map((product: any) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}
