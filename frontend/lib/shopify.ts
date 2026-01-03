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

// CART API (New Shopify Standard)

// Create a new cart
export async function createCart() {
  const query = `
    mutation cartCreate {
      cartCreate {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                    }
                    priceV2 {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const data = await shopifyFetch<{cartCreate: any}>({query})
  return data.cartCreate.cart
}

// Add items to cart
export async function addToCart(cartId: string, lines: Array<{merchandiseId: string; quantity: number}>) {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                    }
                    priceV2 {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const data = await shopifyFetch<{cartLinesAdd: any}>({
    query,
    variables: {cartId, lines},
  })

  return data.cartLinesAdd.cart
}

// Update cart line items
export async function updateCartLines(
  cartId: string,
  lines: Array<{id: string; quantity: number}>,
) {
  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                    }
                    priceV2 {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const data = await shopifyFetch<{cartLinesUpdate: any}>({
    query,
    variables: {cartId, lines},
  })

  return data.cartLinesUpdate.cart
}

// Remove items from cart
export async function removeFromCart(cartId: string, lineIds: string[]) {
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                    }
                    priceV2 {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const data = await shopifyFetch<{cartLinesRemove: any}>({
    query,
    variables: {cartId, lineIds},
  })

  return data.cartLinesRemove.cart
}

// Get cart by ID
export async function getCart(cartId: string) {
  const query = `
    query cart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                    handle
                  }
                  priceV2 {
                    amount
                    currencyCode
                  }
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  `

  const data = await shopifyFetch<{cart: any}>({
    query,
    variables: {cartId},
  })

  return data.cart
}
