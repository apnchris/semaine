import {client} from './client'
import {getAllProducts} from './shopify'

export async function syncShopifyProducts() {
  try {
    console.log('Fetching products from Shopify...')
    const shopifyProducts = await getAllProducts()

    console.log(`Found ${shopifyProducts.length} products in Shopify`)

    const results = {
      created: 0,
      updated: 0,
      errors: 0,
    }

    for (const shopifyProduct of shopifyProducts) {
      try {
        // Check if product already exists in Sanity
        const existingProduct = await client.fetch(
          `*[_type == "product" && shopifyId == $shopifyId][0]`,
          {shopifyId: shopifyProduct.id},
        )

        const productData = {
          _type: 'product',
          shopifyId: shopifyProduct.id,
          handle: shopifyProduct.handle,
          slug: {
            _type: 'slug',
            current: shopifyProduct.handle,
          },
          title: shopifyProduct.title,
          // Only sync description if it doesn't exist (preserve editorial content)
          ...((!existingProduct || !existingProduct.description) && shopifyProduct.description
            ? {
                description: [
                  {
                    _type: 'block',
                    _key: 'description',
                    style: 'normal',
                    children: [
                      {
                        _type: 'span',
                        text: shopifyProduct.description,
                      },
                    ],
                  },
                ],
              }
            : {}),
        }

        if (existingProduct) {
          // Update existing product (preserving editorial fields)
          await client
            .patch(existingProduct._id)
            .set({
              shopifyId: productData.shopifyId,
              handle: productData.handle,
              slug: productData.slug,
            })
            .commit()
          results.updated++
          console.log(`Updated: ${shopifyProduct.title}`)
        } else {
          // Create new product
          await client.create(productData)
          results.created++
          console.log(`Created: ${shopifyProduct.title}`)
        }
      } catch (error) {
        console.error(`Error syncing product ${shopifyProduct.title}:`, error)
        results.errors++
      }
    }

    console.log('Sync complete:', results)
    return results
  } catch (error) {
    console.error('Failed to sync Shopify products:', error)
    throw error
  }
}
