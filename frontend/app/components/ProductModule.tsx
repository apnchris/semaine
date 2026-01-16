'use client'

import AddToCart from '@/app/components/AddToCart'
import ProductImagesSwiper from '@/app/components/ProductImagesSwiper'
import RelatedProducts from '@/app/components/RelatedProducts'
import {DeliveryIcon, PaymentIcon, ReturnIcon} from '@/app/components/Vectors'
import styles from '../css/components/productPage.module.css'

interface ProductDetailsProps {
  product: {
    store: {
      title: string
      images?: any[]
      descriptionHtml?: string
      metafields?: {
        details_column_01?: string
        details_column_02?: string
      }
      variants?: any[]
    }
    body?: any[]
    modules?: any[]
    shopPage?: {
      shipping?: string
      returns?: string
      payment?: string
    }
  }
  showTerms?: boolean
  showEditorialContent?: boolean
}

export default function ProductModule({
  product,
  showTerms = true,
  showEditorialContent = true,
}: ProductDetailsProps) {
  return (
    <div className={`${styles.productGrid}`}>
      {/* Product Images from Shopify */}
      {product.store.images && product.store.images.length > 0 && (
        <ProductImagesSwiper
          images={product.store.images}
          productTitle={product.store.title}
        />
      )}

      <div className={`${styles.productInfos}`}>
        <div className={`${styles.productActions}`}>
          <h1 className={`${styles.productTitle} font-l`}>{product.store.title}</h1>

          {/* Add to Cart */}
          {product.store.variants && product.store.variants.length > 0 && (
            <AddToCart
              variants={product.store.variants
                .filter((v: any) => v && v.store)
                .map((v: any) => ({
                  id: v.store.gid,
                  title: v.store.title,
                  price: v.store.price,
                  compareAtPrice: v.store.compareAtPrice,
                  sku: v.store.sku,
                  availableForSale: v.store.inventory?.isAvailable ?? false,
                }))}
              productTitle={product.store.title}
            />
          )}
        </div>

        {/* Shopify Description */}
        {product.store.descriptionHtml && (
          <div
            className={`${styles.productDescription} ${styles.productInfoBlock} book`}
            dangerouslySetInnerHTML={{__html: product.store.descriptionHtml}}
          />
        )}

        {/* Shopify Metafields */}
        {product.store.metafields && (
          <div className={`${styles.productDetails} ${styles.productInfoBlock} book`}>
            <div className={`${styles.productInfoBlockGrid}`}>
              {product.store.metafields.details_column_01 && (
                <div className={`${styles.productDetail}`}>
                  <pre style={{whiteSpace: 'pre-wrap'}}>
                    {product.store.metafields.details_column_01}
                  </pre>
                </div>
              )}
              {product.store.metafields.details_column_02 && (
                <div className={`${styles.productDetail}`}>
                  <pre style={{whiteSpace: 'pre-wrap'}}>
                    {product.store.metafields.details_column_02}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Shopping Terms */}
        {showTerms && product.shopPage && (
          <div className={`${styles.productTerms} ${styles.productInfoBlock} book`}>
            <div className={`${styles.productInfoBlockGrid}`}>
              <div className={`${styles.productTermsColumn}`}>
                {product.shopPage.shipping && (
                  <div className={`${styles.productDetail}`}>
                    <DeliveryIcon />
                    <pre style={{whiteSpace: 'pre-wrap'}}>{product.shopPage.shipping}</pre>
                  </div>
                )}
                {product.shopPage.returns && (
                  <div className={`${styles.productDetail}`}>
                    <ReturnIcon />
                    <pre style={{whiteSpace: 'pre-wrap'}}>{product.shopPage.returns}</pre>
                  </div>
                )}
              </div>
              {product.shopPage.payment && (
                <div className={`${styles.productDetail}`}>
                  <PaymentIcon />
                  <pre style={{whiteSpace: 'pre-wrap'}}>{product.shopPage.payment}</pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Editorial Content from Sanity */}
        {showEditorialContent && (
          <div className={`${styles.productEditorialContent}`}>
            {/* You can render portable text here with a PortableText component */}
            {product.body && <p>Editorial content available</p>}
            
            {/* Related Products Modules */}
            {product.modules && product.modules.length > 0 && (
              <div className={styles.productModules}>
                {product.modules.map((module: any) => (
                  <RelatedProducts key={module._key} module={module} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
