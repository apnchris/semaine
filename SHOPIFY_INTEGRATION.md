# Shopify + Sanity Hybrid Integration

## Setup Complete! ✅

The Shopify hybrid model has been integrated into your Next.js + Sanity site.

## What Was Added

### Studio (Backend)
1. **Product Schema** - [studio/src/schemaTypes/documents/product.ts](studio/src/schemaTypes/documents/product.ts)
   - Shopify product references (ID, handle)
   - Editorial content fields
   - Tastemaker associations
   - Featured product flag
   - SEO fields
   
2. **Structure Updated** - Products now appear in the Studio sidebar

### Frontend
1. **Shopify Client** - [frontend/lib/shopify.ts](frontend/lib/shopify.ts)
   - `getProduct(handle)` - Fetch single product
   - `getProducts(first)` - Fetch multiple products
   - `createCheckout(lineItems)` - Create checkout
   - `getCollection(handle)` - Get collection
   - `searchProducts(query)` - Search products

### Environment Variables
- **Frontend**: Added Shopify credentials to `.env.local`
- **Studio**: Created `.env.example` template

## Next Steps

### 1. Set Up Shopify API Credentials

#### Storefront API (Frontend)
1. Go to your Shopify Admin: `https://your-store.myshopify.com/admin`
2. Navigate to **Settings → Apps and sales channels → Develop apps**
3. Create a new app or select existing
4. Configure **Storefront API** scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
5. Get your **Storefront Access Token**
6. Update `.env.local`:
   ```
   NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
   NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token
   ```

### 2. Create Product Pages

Create `frontend/app/products/[slug]/page.tsx`:
```typescript
import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {getProduct} from '@/lib/shopify'
import {defineQuery} from 'next-sanity'

const PRODUCT_QUERY = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    shopifyId,
    handle,
    title,
    description,
    featuredImage,
    tasteMakers[]->{name, slug}
  }
`)

export default async function ProductPage({params}) {
  const {slug} = await params
  
  // Get Sanity content
  const {data: sanityProduct} = await sanityFetch({
    query: PRODUCT_QUERY,
    params: {slug},
  })
  
  if (!sanityProduct) notFound()
  
  // Get live Shopify data
  const shopifyProduct = await getProduct(sanityProduct.handle)
  
  return (
    <article>
      <h1>{sanityProduct.title || shopifyProduct.title}</h1>
      {/* Render product details */}
    </article>
  )
}
```

### 3. Add Products to Studio

1. Start your Studio: `cd studio && npm run dev`
2. Navigate to **Products** in the sidebar
3. Create a new product:
   - Add the Shopify product **handle** (from Shopify URL)
   - Add editorial content
   - Associate tastemakers
   - Generate slug

### 4. Optional: Sync Products Automatically

Create a webhook endpoint to automatically sync Shopify products to Sanity when they're created/updated in Shopify.

### 5. Add Cart Functionality

Install Shopify Buy SDK:
```bash
cd frontend
npm install shopify-buy
```

## Architecture

```
User Request
    ↓
Next.js Page
    ↓
├─→ Sanity (Editorial content, associations)
│   - Product description
│   - Tastemaker references
│   - Custom fields
│
└─→ Shopify (Live product data)
    - Price
    - Inventory
    - Variants
    - Images
```

## Benefits

✅ **Live pricing** from Shopify
✅ **Real-time inventory** 
✅ **Rich editorial content** in Sanity
✅ **Tastemaker associations**
✅ **SEO control** via Sanity
✅ **Checkout** through Shopify

## Resources

- [Shopify Storefront API Docs](https://shopify.dev/docs/api/storefront)
- [Sanity + Commerce Guide](https://www.sanity.io/guides/e-commerce)
