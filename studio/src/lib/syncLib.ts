/**
 * Sync library - can be used both in Studio actions and API routes
 */
import {createClient} from '@sanity/client'

// Shopify Admin API Client
const SHOPIFY_DOMAIN = process.env.SANITY_STUDIO_SHOPIFY_DOMAIN!
const SHOPIFY_ADMIN_TOKEN = process.env.SANITY_STUDIO_SHOPIFY_ADMIN_ACCESS_TOKEN!
const SHOPIFY_API_VERSION = '2024-01'

// Sanity Client
const sanityClient = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_STUDIO_API_TOKEN || '',
  useCdn: false,
})

async function shopifyAdminFetch({query, variables = {}}: {query: string; variables?: any}) {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_ADMIN_TOKEN) {
    throw new Error('Missing Shopify credentials. Check your .env file.')
  }

  const url = `https://${SHOPIFY_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`
  
  console.log('Fetching from Shopify:', url)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
      },
      body: JSON.stringify({query, variables}),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Shopify API error:', response.status, errorText)
      throw new Error(`Shopify API error (${response.status}): ${response.statusText}. ${errorText}`)
    }

    const json = await response.json()

    if (json.errors) {
      console.error('Shopify GraphQL errors:', json.errors)
      throw new Error(`Shopify GraphQL error: ${JSON.stringify(json.errors)}`)
    }

    return json.data
  } catch (error: any) {
    // Handle network errors specifically
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error(
        'Network error: Cannot reach Shopify API. This might be due to CORS restrictions when running in the browser. ' +
        'The sync needs to run server-side. Please check that your Shopify domain and credentials are correct.'
      )
    }
    throw error
  }
}

async function getAllProducts() {
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

  let allProducts: any[] = []
  let hasNextPage = true
  let cursor: string | null = null

  while (hasNextPage) {
    const data = await shopifyAdminFetch({
      query,
      variables: {first: 250, after: cursor},
    })

    allProducts = [...allProducts, ...data.products.edges.map((edge: any) => edge.node)]
    hasNextPage = data.products.pageInfo.hasNextPage
    cursor = data.products.pageInfo.endCursor
  }

  return allProducts
}

export async function syncShopifyProducts() {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_ADMIN_TOKEN) {
    throw new Error('Missing Shopify Admin API credentials in environment variables')
  }

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
        // Skip if product is not active
        if (shopifyProduct.status !== 'ACTIVE') {
          continue
        }

        // Check if product already exists in Sanity
        const existingProduct = await sanityClient.fetch(
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
          // Only set title if it doesn't exist (allow overrides)
          ...((!existingProduct || !existingProduct.title) && shopifyProduct.title
            ? {title: shopifyProduct.title}
            : {}),
        }

        if (existingProduct) {
          // Update existing product (preserving editorial fields)
          await sanityClient
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
          await sanityClient.create({
            ...productData,
            title: shopifyProduct.title, // Always set on create
          })
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
