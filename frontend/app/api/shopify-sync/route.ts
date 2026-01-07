import {NextRequest, NextResponse} from 'next/server'
import {createClient} from '@sanity/client'

const sanityClient = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

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

    console.log('Received Shopify sync webhook:', payload.action)

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
      console.log(`Marked ${payload.productIds.length} products as deleted`)
      return NextResponse.json({success: true})
    }

    // Handle product create/update/sync
    if ('products' in payload) {
      const mutations = payload.products.map((product) => {
        const productId = product.id.replace('gid://shopify/Product/', '')

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

        return {
          createOrReplace: {
            _type: 'product',
            _id: `shopifyProduct-${productId}`,
            store: {
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
              images: images, // ← THE IMAGES ARRAY!
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
              createdAt: product.createdAt,
              updatedAt: product.updatedAt,
              isDeleted: false,
            },
          },
        }
      })

      const result = await sanityClient.transaction(mutations).commit()
      console.log(`Synced ${payload.products.length} products with images`)
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
