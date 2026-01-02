import {NextRequest, NextResponse} from 'next/server'
import {createClient} from '@sanity/client'

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN!,
  useCdn: false,
})

interface ShopifyProduct {
  id: string
  title: string
  handle: string
  status: string
}

async function fetchShopifyProducts() {
  const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN
  const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN

  if (!SHOPIFY_DOMAIN || !SHOPIFY_ADMIN_TOKEN) {
    throw new Error('Missing Shopify credentials in environment variables')
  }

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
            status
          }
        }
      }
    }
  `

  let allProducts: ShopifyProduct[] = []
  let hasNextPage = true
  let cursor: string | null = null

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

    allProducts = [...allProducts, ...json.data.products.edges.map((edge: any) => edge.node)]
    hasNextPage = json.data.products.pageInfo.hasNextPage
    cursor = json.data.products.pageInfo.endCursor
  }

  return allProducts
}

export async function POST(request: NextRequest) {
  try {
    console.log('Starting product sync from Shopify...')
    console.log('Environment check:')
    console.log('- SHOPIFY_DOMAIN:', process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN)
    console.log('- SHOPIFY_ADMIN_TOKEN:', process.env.SHOPIFY_ADMIN_API_TOKEN ? 'Set' : 'Missing')
    console.log('- SANITY_PROJECT_ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
    console.log('- SANITY_TOKEN:', process.env.SANITY_API_READ_TOKEN ? 'Set' : 'Missing')

    // Fetch products from Shopify
    const shopifyProducts = await fetchShopifyProducts()
    console.log(`Found ${shopifyProducts.length} products in Shopify`)

    const results = {
      created: 0,
      updated: 0,
      errors: 0,
      errorDetails: [] as string[],
    }

    // Sync each product to Sanity
    for (const product of shopifyProducts) {
      try {
        console.log(`Processing product: ${product.title} (${product.handle})`)
        
        // Skip inactive products
        if (product.status !== 'ACTIVE') {
          console.log(`Skipping inactive product: ${product.title}`)
          continue
        }

        // Check if product exists
        const existingProduct = await sanityClient.fetch(
          `*[_type == "product" && shopifyId == $shopifyId][0]`,
          {shopifyId: product.id},
        )

        const productData = {
          _type: 'product' as const,
          shopifyId: product.id,
          handle: product.handle,
          slug: {
            _type: 'slug' as const,
            current: product.handle,
          },
        }

        if (existingProduct) {
          // Update existing product
          await sanityClient
            .patch(existingProduct._id)
            .set({
              shopifyId: productData.shopifyId,
              handle: productData.handle,
              slug: productData.slug,
            })
            .commit()
          results.updated++
          console.log(`✅ Updated: ${product.title}`)
        } else {
          // Create new product
          await sanityClient.create({
            ...productData,
            title: product.title,
          })
          results.created++
          console.log(`✅ Created: ${product.title}`)
        }
      } catch (error: any) {
        console.error(`❌ Error syncing product ${product.title}:`, error)
        results.errors++
        results.errorDetails.push(`${product.title}: ${error.message}`)
      }
    }

    console.log('Sync complete:', results)
    
    // Return response with CORS headers
    return NextResponse.json(results, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error: any) {
    console.error('Sync error:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      {error: error.message || 'Sync failed', details: error.stack},
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      },
    )
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
