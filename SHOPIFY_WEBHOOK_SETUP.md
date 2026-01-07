# Shopify Custom Webhook Sync Setup

This enables syncing product images from Shopify to Sanity using custom webhooks.

## What This Fixes

The standard Sanity Connect app doesn't sync the `images` array - only `previewImageUrl`. Custom webhooks receive the full product data including all images.

## Setup Steps

### 1. Ensure Environment Variables

Make sure your `frontend/.env.local` has:

```env
SANITY_STUDIO_PROJECT_ID=yvjwkxhv
SANITY_STUDIO_DATASET=production
SANITY_API_WRITE_TOKEN=your_write_token_here
```

### 2. Deploy Your API Endpoint

The webhook endpoint is at: `/app/api/shopify-sync/route.ts`

After deploying your frontend to Vercel (or your hosting), your webhook URL will be:
```
https://your-domain.com/api/shopify-sync
```

### 3. Configure Sanity Connect App

In your Shopify Admin:

1. Go to **Apps** → **Sanity Connect**
2. Scroll down to the **"Custom sync"** section
3. Under **"Function URL"**, enter your webhook URL:
   - Local: `https://abc123.ngrok-free.app/api/shopify-sync`
   - Production: `https://your-domain.com/api/shopify-sync`
4. Click **"Save"** or **"Update"**

**Note**: Once you enable custom sync, the app will send the full payload including the `images` array to your endpoint instead of using the standard sync.

### 4. Test the Sync

1. In the Sanity Connect app, click **"Sync Now"** or **"Test Webhook"**
2. Check your Vercel logs (or server logs) to see if the webhook was received
3. Query a product in Sanity to verify images are now populated:

```groq
*[_type == "product"][0]{
  _id,
  store {
    title,
    images
  }
}
```

### 5. Trigger Initial Sync

After configuration, you may need to:
- Click "Sync All Products" in the Sanity Connect app
- Or update a product in Shopify to trigger the webhook

## How It Works

1. **Shopify** → Changes product
2. **Sanity Connect App** → Sends webhook to your endpoint
3. **Your API** (`/api/shopify-sync`) → Receives full product data with images
4. **Your API** → Writes to Sanity with `createOrReplace` mutation
5. **Sanity** → Product now has `store.images` array populated ✅

## Troubleshooting

### Webhook not firing?
- Check Sanity Connect app configuration in Shopify
- Verify your webhook URL is publicly accessible
- Check Vercel function logs for errors

### Images still not syncing?
- Ensure products have images in Shopify
- Check the API logs to see what payload is being received
- Verify your `SANITY_API_WRITE_TOKEN` has write permissions

### Local Testing
For local development, use a tool like [ngrok](https://ngrok.com/) to expose your localhost:
```bash
ngrok http 3000
# Then use the ngrok URL: https://abc123.ngrok.io/api/shopify-sync
```

## Data Structure

The `images` array will be populated with:
```typescript
{
  _type: 'object',
  _key: 'unique-image-id',
  id: 'gid://shopify/ProductImage/123',
  altText: 'Alt text',
  height: 1000,
  width: 1000,
  url: 'https://cdn.shopify.com/...',
  src: 'https://cdn.shopify.com/...',
  originalSrc: 'https://cdn.shopify.com/...'
}
```
