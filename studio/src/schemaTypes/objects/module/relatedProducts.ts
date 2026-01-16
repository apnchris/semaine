import {ThLargeIcon} from '@sanity/icons'
import pluralize from 'pluralize-esm'
import {defineField} from 'sanity'

export const relatedProducts = defineField({
  name: 'relatedProducts',
  title: 'Related Products',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
    }),
    defineField({
      title: 'Products',
      name: 'products',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            {type: 'product'}
          ]
        }
      ]
    }),
  ],
  preview: {
    select: {
      products: 'products',
    },
    prepare({products}) {
      return {
        subtitle: 'relatedProducts',
        title: products?.length > 0 ? pluralize('item', products.length, true) : 'No items',
      }
    },
  },
})
