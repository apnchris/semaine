import {defineField, defineType} from 'sanity'
import {PackageIcon} from '@sanity/icons'

export const shopifySync = defineType({
  name: 'shopifySync',
  title: 'Shopify Sync',
  type: 'document',
  icon: PackageIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Shopify Product Sync',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'instructions',
      title: 'Instructions',
      type: 'text',
      initialValue:
        'Click the "Sync Products" button in the menu bar above to automatically import all products from your Shopify store.\n\nThis will:\n- Create new products that don\'t exist in Sanity\n- Update existing products with latest Shopify data\n- Preserve any editorial content you\'ve added',
      readOnly: true,
      rows: 6,
    }),
    defineField({
      name: 'lastSyncedAt',
      title: 'Last Synced',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'lastSyncResults',
      title: 'Last Sync Results',
      type: 'object',
      fields: [
        {name: 'created', type: 'number', title: 'Created'},
        {name: 'updated', type: 'number', title: 'Updated'},
        {name: 'errors', type: 'number', title: 'Errors'},
      ],
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      lastSyncedAt: 'lastSyncedAt',
      results: 'lastSyncResults',
    },
    prepare({lastSyncedAt, results}) {
      return {
        title: 'Shopify Product Sync',
        subtitle: lastSyncedAt
          ? `Last synced: ${new Date(lastSyncedAt).toLocaleString()}${results ? ` (${results.created} created, ${results.updated} updated)` : ''}`
          : 'Never synced - Click to open and sync',
      }
    },
  },
})
