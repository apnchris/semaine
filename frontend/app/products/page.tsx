import {sanityFetch} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'
import ProductCard from '@/app/components/ProductCard'
import PicksModule from '@/app/components/PicksModule'
import ProductModule from '@/app/components/ProductModule'
import styles from '../css/components/productGrid.module.css'

const SHOP_PAGE_QUERY = defineQuery(`
  {
    "products": *[_type == "product" && !store.isDeleted] | order(store.title asc) {
      _id,
      _type,
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
    },
    "shopPage": *[_type == "shopPage"][0] {
      modules[] {
        _type,
        _key,
        ...,
        picture {
          asset->{
            _id,
            url
          },
          alt
        },
        products[]->{          _id,
          _type,
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
        },
        tasteMakerBreaker[]->{
          _id,
          name,
          slug,
          _type
        },
        links[] {
          ...,
          items[]->{
            _id,
            _type,
            title,
            slug,
            address,
            message,
            location[]->{
              _id,
              city,
              country
            },
            store {
              title,
              slug,
              previewImageUrl,
              priceRange {
                minVariantPrice,
                maxVariantPrice
              },
              vendor,
              productType
            },
            featuredImage {
              asset->{
                _id,
                url
              },
              alt
            }
          }
        },
        product[]->{
          _id,
          _type,
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
      },
      shipping,
      returns,
      payment
    }
  }
`)

export default async function ProductsPage() {
  const {data} = await sanityFetch({
    query: SHOP_PAGE_QUERY,
  })

  const products = data?.products || []
  const shopPage = data?.shopPage

  if (!products || products.length === 0) {
    return (
      <div className={`${styles.storePage}`}>
        <p>No products found.</p>
      </div>
    )
  }

  return (
    <div className={`${styles.storePage}`}>      
      {/* Shop Page Modules */}
      {shopPage?.modules && (
        <div className={styles.storeModules}>
          {shopPage.modules.map((module: any) => (
            <div key={module._key}>
              {module._type === 'picksModule' && module.links && (
                <PicksModule
                  title={module.title}
                  picture={module.picture}
                  tasteMakerBreaker={module.tasteMakerBreaker}
                  customCurator={module.customCurator}
                  links={module.links}
                />
              )}
              {module._type === 'gridShop' && module.products && (
                <div className={styles.storeGridModule}>
                  <h2 className={`${styles.shopTitle} font-l`}>
                    {module.title}
                  </h2>

                  <div className={`${styles.storeGrid}`}>
                    {module.products.map((product: any) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                </div>
              )}
              {module._type === 'productModule' && (
                <div className="product-module-wrapper">
                  {module.product && module.product.length > 0 ? (
                    <ProductModule 
                      product={{
                        ...module.product[0],
                        shopPage: {
                          shipping: shopPage?.shipping,
                          returns: shopPage?.returns,
                          payment: shopPage?.payment
                        }
                      }}
                      showTerms={false}
                      showEditorialContent={false}
                    />
                  ) : (
                    <p>No product in this module</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
