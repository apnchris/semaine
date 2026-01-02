/**
 * Shopify Admin API Client
 * Used for syncing products from Shopify to Sanity
 */

const SHOPIFY_DOMAIN = process.env.SANITY_STUDIO_SHOPIFY_DOMAIN!
const SHOPIFY_ADMIN_TOKEN = process.env.SANITY_STUDIO_SHOPIFY_ADMIN_ACCESS_TOKEN!
const SHOPIFY_API_VERSION = '2024-01'

if (!SHOPIFY_DOMAIN || !SHOPIFY_ADMIN_TOKEN) {
  console.warn('Missing Shopify Admin API credentials')
}

interface ShopifyAdminFetchParams {
  query: string
  variables?: Record<string, any>
}

async function shopifyAdminFetch<T = any>({
  query,
  variables = {},
}: ShopifyAdminFetchParams): Promise<T> {
  const response = await fetch(
    `https://${SHOPIFY_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
      },
      body: JSON.stringify({query, variables}),
    },
  )

  if (!response.ok) {
    throw new Error(`Shopify Admin API error: ${response.statusText}`)
  }

  const json = await response.json()

  if (json.errors) {
    throw new Error(`Shopify GraphQL error: ${JSON.stringify(json.errors)}`)
  }

  return json.data
}

export async function getAllProducts() {
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
            featuredImage {
              url
              altText
            }
            tags
            createdAt
            updatedAt
          }
        }
      }
    }
  `

  let allProducts: any[] = []
  let hasNextPage = true
  let cursor: string | null = null

  while (hasNextPage) {
    const data = await shopifyAdminFetch<{products: any}>({
      query,
      variables: {first: 250, after: cursor},
    })

    allProducts = [...allProducts, ...data.products.edges.map((edge: any) => edge.node)]
    hasNextPage = data.products.pageInfo.hasNextPage
    cursor = data.products.pageInfo.endCursor
  }

  return allProducts
}

export async function getProduct(id: string) {
  const query = `
    query getProduct($id: ID!) {
      product(id: $id) {
        id
        title
        handle
        description
        status
        featuredImage {
          url
          altText
        }
        tags
      }
    }
  `

  const data = await shopifyAdminFetch<{product: any}>({
    query,
    variables: {id},
  })

  return data.product
}
