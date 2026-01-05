import {ThLargeIcon} from '@sanity/icons'
import pluralize from 'pluralize-esm'
import {defineField} from 'sanity'

export const gridGuide = defineField({
  name: 'gridGuide',
  title: 'Grid Guide',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({
      title: 'Guides',
      name: 'guides',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            {type: 'guide'}
          ]
        }
      ]
    }),
  ],
  preview: {
    select: {
      guides: 'guides',
    },
    prepare({guides}) {
      return {
        subtitle: 'Grid',
        title: guides?.length > 0 ? pluralize('item', guides.length, true) : 'No items',
      }
    },
  },
})
