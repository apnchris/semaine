/**
 * Server-side API route for syncing Shopify products
 * This runs on the server to avoid CORS issues
 */
import type {SanityClient} from 'sanity'

interface ShopifyProduct {
  id: string
  title: string
  handle: string
  description: string
  status: string
}

export async function syncProducts(client: SanityClient) {
  // Get credentials from environment
  const SHOPIFY_DOMAIN = process.env.SANITY_STUDIO_SHOPIFY_DOMAIN
  const SHOPIFY_ADMIN_TOKEN = process.env.SANITY_STUDIO_SHOPIFY_ADMIN_ACCESS_TOKEN
  
  if (!SHOPIFY_DOMAIN || !SHOPIFY_ADMIN_TOKEN) {
    throw new Error(
      'Missing Shopify credentials. Please add SANITY_STUDIO_SHOPIFY_DOMAIN and SANITY_STUDIO_SHOPIFY_ADMIN_ACCESS_TOKEN to your .env file'
    )
  }

  // Fetch products from Shopify
  const query = `
    query getProducts($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            title
            handle
            description
            status
          }
        }
      }
    }
  `

  let allProducts: ShopifyProduct[] = []
  let hasNextPage = true
  let cursor: string | null = null

  // Fetch all products with pagination
  while (hasNextPage) {
    const response = await fetch(
      `https://${SHOPIFY_DOMAIN}/admin/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
        },
        body: JSON.stringify({
          query,
          variables: {first: 250, after: cursor},
        }),
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Shopify API error (${response.status}): ${errorText}`)
    }

    const json = await response.json()

    if (json.errors) {
      throw new Error(`Shopify GraphQL error: ${JSON.stringify(json.errors)}`)
    }

    const data = json.data
    allProducts = [...allProducts, ...data.products.edges.map((edge: any) => edge.node)]
    hasNextPage = data.products.pageInfo.hasNextPage
    cursor = data.products.pageInfo.endCursor
  }

  // Sync products to Sanity
  const results = {
    created: 0,
    updated: 0,
    errors: 0,
  }

  for (const shopifyProduct of allProducts) {
    try {
      // Skip inactive products
      if (shopifyProduct.status !== 'ACTIVE') {
        continue
      }

      // Check if product exists
      const existingProduct = await client.fetch(
        `*[_type == "product" && shopifyId == $shopifyId][0]`,
        {shopifyId: shopifyProduct.id},
      )

      const productData = {
        _type: 'product' as const,
        shopifyId: shopifyProduct.id,
        handle: shopifyProduct.handle,
        slug: {
          _type: 'slug' as const,
          current: shopifyProduct.handle,
        },
        ...((!existingProduct || !existingProduct.title) && shopifyProduct.title
          ? {title: shopifyProduct.title}
          : {}),
      }

      if (existingProduct) {
        // Update existing
        await client
          .patch(existingProduct._id)
          .set({
            shopifyId: productData.shopifyId,
            handle: productData.handle,
            slug: productData.slug,
          })
          .commit()
        results.updated++
      } else {
        // Create new
        await client.create({
          ...productData,
          title: shopifyProduct.title,
        })
        results.created++
      }
    } catch (error) {
      console.error(`Error syncing product ${shopifyProduct.title}:`, error)
      results.errors++
    }
  }

  return results
}
