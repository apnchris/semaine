import {NextRequest, NextResponse} from 'next/server'
import {createClient} from '@sanity/client'

const sanityClient = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

// Fetch metafields from Shopify
async function fetchProductMetafields(productGid: string) {
  const query = `
    query getProductMetafields($id: ID!) {
      product(id: $id) {
        metafields(keys: ["data.details_column_01", "data.details_column_02"], first: 10) {
          edges {
            node {
              key
              value
            }
          }
        }
      }
    }
  `

  const response = await fetch(
    `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN || '',
      },
      body: JSON.stringify({
        query,
        variables: {id: productGid},
      }),
    }
  )

  if (!response.ok) {
    console.error(`Shopify API error: ${response.status} ${response.statusText}`)
    return {}
  }

  const result = await response.json()
  
  if (result.errors) {
    console.error('GraphQL errors:', result.errors)
    return {}
  }

  const metafields: Record<string, string> = {}

  result.data?.product?.metafields?.edges?.forEach(({node}: any) => {
    // The key comes back as just "details_column_01" or "details_column_02" without the namespace
    const key = node.key.replace('data.', '') // Remove namespace if present
    metafields[key] = node.value
  })
  return metafields
}

type ProductImage = {
  id: string
  altText?: string
  height?: number
  width?: number
  src: string
}

type Product = {
  id: string
  title: string
  description: string
  descriptionHtml: string
  featuredImage?: ProductImage
  handle: string
  images: ProductImage[]
  options: Array<{
    id: string
    name: string
    position: number
    values: string[]
  }>
  priceRange: {
    minVariantPrice?: number
    maxVariantPrice?: number
  }
  productType: string
  tags: string[]
  variants: any[]
  vendor: string
  status: 'active' | 'archived' | 'draft' | 'unknown'
  publishedAt: string
  createdAt: string
  updatedAt: string
  metafields?: {
    details_column_01?: string
    details_column_02?: string
  }
}

type WebhookPayload =
  | {
      action: 'create' | 'update' | 'sync'
      products: Product[]
    }
  | {
      action: 'delete'
      productIds: number[]
    }

export async function POST(request: NextRequest) {
  try {
    const payload: WebhookPayload = await request.json()
    // Log the full webhook payload for debugging
    console.log('Shopify Webhook Payload:', JSON.stringify(payload, null, 2))

    // Handle product deletion
    if (payload.action === 'delete') {
      const mutations = payload.productIds.map((id) => ({
        patch: {
          id: `shopifyProduct-${id}`,
          set: {
            'store.isDeleted': true,
          },
        },
      }))

      await sanityClient.transaction(mutations).commit()
      return NextResponse.json({success: true})
    }

    // Handle product create/update/sync
    if ('products' in payload) {
      const allMutations = await Promise.all(
        payload.products.map(async (product) => {
          // Always fetch the latest product data from Shopify (with availableForSale)
          let fullProduct = product
          let fetchedVariants: any[] | null = null
          try {
            const shopifyProductId = product.id
            const shopifyResponse = await fetch(
              `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN || '',
                },
                body: JSON.stringify({
                  query: `query getProduct($id: ID!) { product(id: $id) { id title variants(first: 100) { edges { node { id title availableForSale inventoryQuantity inventoryPolicy sku price compareAtPrice selectedOptions { name value } image { src } } } } } } }`,
                  variables: { id: shopifyProductId },
                }),
              }
            )
            if (shopifyResponse.ok) {
              const shopifyData = await shopifyResponse.json()
              console.log('Shopify API response for', product.id, ':', JSON.stringify(shopifyData, null, 2))
              if (shopifyData.data?.product?.variants?.edges) {
                // Extract and validate the latest variant data from Shopify
                const mappedVariants = shopifyData.data.product.variants.edges.map((edge: any) => edge.node)
                fetchedVariants = mappedVariants
                console.log('Fetched latest variant data from Shopify for', product.id, `(${mappedVariants.length} variants)`)
                // Log sample variant to verify availableForSale is present
                if (mappedVariants.length > 0) {
                  console.log('Sample fetched variant:', JSON.stringify(mappedVariants[0], null, 2))
                }
              } else {
                console.warn('Shopify API response missing variant data structure for', product.id)
                console.warn('Response structure:', JSON.stringify(shopifyData, null, 2))
              }
            } else {
              const errorText = await shopifyResponse.text()
              console.error('Failed to fetch latest product data from Shopify:', shopifyResponse.status, shopifyResponse.statusText, errorText)
            }
          } catch (err) {
            console.error('Error fetching latest product data from Shopify:', err)
          }
          
          // Only use fetched variants if we successfully got them, otherwise fall back to webhook variants
          if (fetchedVariants && fetchedVariants.length > 0) {
            fullProduct = {
              ...product,
              variants: fetchedVariants,
            }
            console.log('Using fetched variant data with availability info')
          } else {
            console.warn('Using webhook variant data - availability may be incomplete')
          }
          product = fullProduct
          const productId = product.id.replace('gid://shopify/Product/', '')

          // Fetch existing document to preserve custom fields (check both published and draft)
          const existingDocs = await sanityClient.fetch(
            `{
              "published": *[_id == $id][0]{_id, _rev, body, thumbSize, seo},
              "draft": *[_id == $draftId][0]{_id, _rev, body, thumbSize, seo}
            }`,
            {
              id: `shopifyProduct-${productId}`,
              draftId: `drafts.shopifyProduct-${productId}`
            }
          ).catch(() => ({ published: null, draft: null }))

          // Use draft if available, otherwise use published
          const existingDoc = existingDocs.draft || existingDocs.published

          // Fetch metafields from Shopify
          let metafields = product.metafields || {}
          
          if (!product.metafields || Object.keys(product.metafields).length === 0) {
            try {
              metafields = await fetchProductMetafields(product.id)
            } catch (error) {
              console.error(`Failed to fetch metafields for ${product.id}:`, error)
            }
          }

          // Transform images to match your schema
          const images = product.images.map((img) => ({
            _type: 'object',
            _key: img.id.replace('gid://shopify/ProductImage/', ''),
            id: img.id,
            altText: img.altText || '',
            height: img.height,
            width: img.width,
            url: img.src,
            src: img.src,
            originalSrc: img.src,
          }))

          // Create mutations for variants (as separate documents)
          const variantMutations = product.variants.map((variant) => {
            const variantId = variant.id.replace('gid://shopify/ProductVariant/', '')
            // Log full variant data for debugging
            console.log(`Variant ${variantId} full data:`, JSON.stringify(variant, null, 2))
            
            // Log variant availability data for debugging
            console.log(`Variant ${variantId} availability check:`, {
              availableForSale: variant.availableForSale,
              typeofAvailableForSale: typeof variant.availableForSale,
              inventoryQuantity: variant.inventoryQuantity,
              inventoryPolicy: variant.inventoryPolicy,
            })
            
            // Use availableForSale directly from Shopify - it's the authoritative source
            // Check if availableForSale is a boolean (true or false) - if so, use it directly
            // Only fall back to inventory logic if availableForSale is null/undefined/not a boolean
            let isAvailable: boolean
            if (typeof variant.availableForSale === 'boolean') {
              // availableForSale is explicitly a boolean from Shopify - use it directly (Shopify's source of truth)
              isAvailable = variant.availableForSale
              console.log(`Variant ${variantId} using availableForSale boolean from Shopify: ${isAvailable}`)
            } else if (variant.inventoryPolicy === 'CONTINUE') {
              // If inventory policy is CONTINUE, always available regardless of quantity
              isAvailable = true
              console.log(`Variant ${variantId} using CONTINUE policy: ${isAvailable} (availableForSale was not boolean: ${variant.availableForSale})`)
            } else {
              // Otherwise, check if inventory quantity is greater than 0
              const inventoryQty = typeof variant.inventoryQuantity === 'number' 
                ? variant.inventoryQuantity 
                : (typeof variant.inventoryQuantity === 'string' 
                  ? parseInt(variant.inventoryQuantity, 10) 
                  : 0)
              isAvailable = inventoryQty > 0
              console.log(`Variant ${variantId} using inventory quantity (${inventoryQty}): ${isAvailable} (availableForSale was not boolean: ${variant.availableForSale})`)
            }
            
            console.log(`Variant ${variantId} final calculated availability: ${isAvailable}`)
            return {
              createOrReplace: {
                _type: 'productVariant',
                _id: `shopifyProductVariant-${variantId}`,
                availableForSale: isAvailable,
                store: {
                  _type: 'shopifyProductVariant',
                  id: parseInt(variantId),
                  gid: variant.id,
                  productId: parseInt(productId),
                  productGid: product.id,
                  title: variant.title,
                  sku: variant.sku || '',
                  price: parseFloat(variant.price) || 0,
                  compareAtPrice: variant.compareAtPrice ? parseFloat(variant.compareAtPrice) : undefined,
                  previewImageUrl: variant.image?.src || product.featuredImage?.src || product.images[0]?.src,
                  option1: variant.selectedOptions?.[0]?.value,
                  option2: variant.selectedOptions?.[1]?.value,
                  option3: variant.selectedOptions?.[2]?.value,
                  inventory: {
                    _type: 'inventory',
                    isAvailable: isAvailable,
                    management: 'SHOPIFY',
                    policy: variant.inventoryPolicy || 'DENY',
                  },
                  status: product.status,
                  createdAt: product.createdAt,
                  updatedAt: product.updatedAt,
                  isDeleted: false,
                },
              },
            }
          })

          // Create mutation for product with variant references  
          const baseSet: any = {
            'store': {
              _type: 'shopifyProduct',
              id: parseInt(productId),
              gid: product.id,
              title: product.title,
              slug: {
                _type: 'slug',
                current: product.handle,
              },
              descriptionHtml: product.descriptionHtml,
              status: product.status,
              productType: product.productType,
              vendor: product.vendor,
              tags: product.tags.join(', '),
              previewImageUrl: product.featuredImage?.src || product.images[0]?.src,
              images: images,
              metafields: {
                details_column_01: metafields.details_column_01 || '',
                details_column_02: metafields.details_column_02 || '',
              },
              priceRange: {
                minVariantPrice: product.priceRange.minVariantPrice,
                maxVariantPrice: product.priceRange.maxVariantPrice,
              },
              options: product.options.map((opt) => ({
                _type: 'option',
                _key: opt.name,
                name: opt.name,
                values: opt.values,
              })),
              variants: product.variants.map((variant) => {
                const variantId = variant.id.replace('gid://shopify/ProductVariant/', '')
                return {
                  _type: 'reference',
                  _key: variantId,
                  _ref: `shopifyProductVariant-${variantId}`,
                  _weak: true,
                }
              }),
              createdAt: product.createdAt,
              updatedAt: product.updatedAt,
              isDeleted: false,
            },
          }

          // Preserve existing custom fields if they exist
          if (existingDoc?.body) {
            baseSet.body = existingDoc.body
            console.log(`Preserving body for product ${productId}`)
          }
          if (existingDoc?.thumbSize !== undefined) {
            baseSet.thumbSize = existingDoc.thumbSize
            console.log(`Preserving thumbSize (${existingDoc.thumbSize}) for product ${productId}`)
          }
          if (existingDoc?.seo) {
            baseSet.seo = existingDoc.seo
            console.log(`Preserving seo for product ${productId}`)
          }

          if (!existingDoc) {
            console.log(`No existing custom fields found for product ${productId}`)
          }

          const productMutations = [
            // First ensure the document exists with _type
            {
              createIfNotExists: {
                _type: 'product',
                _id: `shopifyProduct-${productId}`,
              },
            },
            // Then patch ONLY the store field and re-set custom fields to preserve them
            {
              patch: {
                id: `shopifyProduct-${productId}`,
                set: baseSet,
              },
            }
          ]

          // Return all mutations for this product (variants + product)
          return [...variantMutations, ...productMutations]
        })
      )

      // Flatten the array of mutation arrays
      const mutations = allMutations.flat()

      const result = await sanityClient.transaction(mutations as any).commit()
      return NextResponse.json({success: true, synced: payload.products.length})
    }

    return NextResponse.json({success: false, error: 'Unknown action'}, {status: 400})
  } catch (error) {
    console.error('Shopify sync error:', error)
    return NextResponse.json(
      {success: false, error: error instanceof Error ? error.message : 'Unknown error'},
      {status: 500}
    )
  }
}
