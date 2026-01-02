const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!
const SHOPIFY_STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!
const SHOPIFY_API_VERSION = '2024-01'

if (!SHOPIFY_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
  throw new Error('Missing Shopify environment variables')
}

interface ShopifyFetchParams {
  query: string
  variables?: Record<string, any>
}

async function shopifyFetch<T = any>({
  query,
  variables = {},
}: ShopifyFetchParams): Promise<T> {
  const response = await fetch(
    `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({query, variables}),
      next: {revalidate: 60}, // Cache for 60 seconds
    },
  )

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.statusText}`)
  }

  const json = await response.json()

  if (json.errors) {
    throw new Error(`Shopify GraphQL error: ${JSON.stringify(json.errors)}`)
  }

  return json.data
}

// Get a single product by handle
export async function getProduct(handle: string) {
  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        description
        descriptionHtml
        handle
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              id
              url
              altText
              width
              height
            }
          }
        }
        variants(first: 250) {
          edges {
            node {
              id
              title
              availableForSale
              selectedOptions {
                name
                value
              }
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
            }
          }
        }
        availableForSale
        tags
      }
    }
  `

  const data = await shopifyFetch<{product: any}>({
    query,
    variables: {handle},
  })

  return data.product
}

// Get multiple products
export async function getProducts(first: number = 10) {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            availableForSale
          }
        }
      }
    }
  `

  const data = await shopifyFetch<{products: any}>({
    query,
    variables: {first},
  })

  return data.products.edges.map((edge: any) => edge.node)
}

// Create a checkout with line items
export async function createCheckout(lineItems: Array<{variantId: string; quantity: number}>) {
  const query = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
          lineItems(first: 250) {
            edges {
              node {
                id
                title
                quantity
              }
            }
          }
        }
        checkoutUserErrors {
          code
          field
          message
        }
      }
    }
  `

  const data = await shopifyFetch({
    query,
    variables: {
      input: {
        lineItems: lineItems.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      },
    },
  })

  return data.checkoutCreate.checkout
}

// Get collection by handle
export async function getCollection(handle: string, first: number = 24) {
  const query = `
    query getCollection($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        id
        title
        description
        handle
        products(first: $first) {
          edges {
            node {
              id
              title
              description
              handle
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              availableForSale
            }
          }
        }
      }
    }
  `

  const data = await shopifyFetch<{collection: any}>({
    query,
    variables: {handle, first},
  })

  return data.collection
}

// Search products
export async function searchProducts(query: string, first: number = 24) {
  const searchQuery = `
    query searchProducts($query: String!, $first: Int!) {
      products(first: $first, query: $query) {
        edges {
          node {
            id
            title
            description
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            availableForSale
          }
        }
      }
    }
  `

  const data = await shopifyFetch<{products: any}>({
    query: searchQuery,
    variables: {query, first},
  })

  return data.products.edges.map((edge: any) => edge.node)
}
