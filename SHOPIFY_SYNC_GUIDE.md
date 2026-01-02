# Automatic Shopify Product Sync

## Overview

Your Sanity Studio now has automatic product synchronization from Shopify! Products are imported with a single click - no manual entry needed.

## How It Works

1. **Navigate to "Sync Shopify Products"** in the Studio sidebar
2. **Click "Sync Products from Shopify"** button in the document menu
3. **Products are automatically created/updated** with:
   - Shopify ID
   - Product handle  
   - Auto-generated slug
   - Product title

## Setup Instructions

### 1. Get Shopify Admin API Credentials

1. Go to your Shopify Admin: `https://your-store.myshopify.com/admin`
2. Navigate to **Settings → Apps and sales channels → Develop apps**
3. Click **Create an app** or select an existing one
4. Go to **API credentials** tab
5. Under **Admin API access scopes**, select:
   - `read_products`
   - `write_products` (optional, for future features)
6. Click **Install app** and reveal **Admin API access token**

### 2. Get Sanity Write Token

1. Go to [manage.sanity.io](https://manage.sanity.io)
2. Select your project
3. Go to **API** → **Tokens**
4. Click **Add API token**
5. Name it "Product Sync" and set permissions to **Editor**
6. Copy the token

### 3. Update Environment Variables

Edit `studio/.env`:

```env
SANITY_STUDIO_PROJECT_ID=yvjwkxhv
SANITY_STUDIO_DATASET=production

# Add these:
SANITY_API_WRITE_TOKEN=sk_your_write_token_here
SANITY_STUDIO_SHOPIFY_DOMAIN=your-store.myshopify.com
SANITY_STUDIO_SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_your_admin_token_here
```

### 4. Restart the Studio

```bash
cd studio
npm run dev
```

## Using the Sync Feature

1. **Open Studio** and navigate to **"Sync Shopify Products"** in the sidebar
2. **Click the "Sync Products from Shopify" button** in the top menu bar
3. **Confirm** the sync operation
4. **Wait** for the sync to complete (you'll see a success message)
5. **View synced products** under the "Products" section

## What Gets Synced

### On First Sync (New Products)
- ✅ Shopify Product ID
- ✅ Product handle
- ✅ Auto-generated slug (from handle)
- ✅ Product title

### On Subsequent Syncs (Existing Products)
- ✅ Updates Shopify ID, handle, and slug
- ✅ **Preserves** all editorial content you've added:
  - Custom descriptions
  - Featured images
  - Tastemaker associations
  - SEO fields
  - Featured flags

## Workflow

```
Shopify Store
    ↓
[Sync Products Button]
    ↓
Sanity Studio
    ↓
Add Editorial Content:
- Descriptions
- Tastemaker associations
- Featured images
- SEO metadata
    ↓
Frontend (Next.js)
- Combines Sanity content
- With live Shopify data
```

## Benefits

✅ **No manual data entry** - Products sync automatically
✅ **Preserve editorial content** - Your custom content isn't overwritten
✅ **One-click sync** - Easy to keep products up to date
✅ **Bulk import** - Import hundreds of products at once
✅ **Safe updates** - Existing customizations are protected

## Troubleshooting

### "Missing Shopify Admin API credentials"
- Make sure you've added the Shopify environment variables to `studio/.env`
- Restart the Studio after adding variables

### "Sync failed: Unauthorized"
- Check that your Shopify Admin API token is correct
- Verify the token has `read_products` scope

### Products not appearing
- Check the sync results message - look for errors
- Make sure products are "Active" in Shopify (draft products are skipped)
- Check the browser console for detailed error messages

## Next Steps

After syncing products:
1. **Add editorial descriptions** to products
2. **Associate tastemakers** with products
3. **Upload custom featured images**
4. **Set SEO metadata**
5. **Mark products as featured** for homepage display

The frontend will combine:
- **Sanity content** (descriptions, associations, images)
- **Live Shopify data** (pricing, inventory, variants, checkout)
