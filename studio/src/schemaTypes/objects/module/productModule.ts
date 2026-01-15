import {ThLargeIcon} from '@sanity/icons'
import pluralize from 'pluralize-esm'
import {defineField} from 'sanity'

export const productModule = defineField({
  name: 'productModule',
  title: 'Product Module',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({
      title: 'Product',
      name: 'product',
      type: 'array',
      validation: (rule) => rule.max(1),
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
      product: 'product',
    },
    prepare({product}) {
      return {
        subtitle: 'Product Module',
        title: product?.length > 0 ? pluralize('item', product.length, true) : 'No items',
      }
    },
  },
})
