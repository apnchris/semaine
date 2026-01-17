import {ThLargeIcon} from '@sanity/icons'
import pluralize from 'pluralize-esm'
import {defineField} from 'sanity'
import { title } from '../../../lib/initialValues'

export const gridShop = defineField({
  name: 'gridShop',
  title: 'Grid Shop',
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
      title: 'title',
    },
    prepare({title}) {
      return {
        subtitle: 'Grid',
        title: title,
      }
    },
  },
})
