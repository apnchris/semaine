import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const shopPage = defineType({
  name: 'shopPage',
  title: 'Shop',
  icon: UserIcon,
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Content',
    },
    {
      name: 'settings',
      title: 'Settings',
    },
  ],
  fields: [
    defineField({
      name: 'modules',
      title: 'Modules',
      type: 'array',
      of: [{type: 'picksModule'}, {type: 'gridShop'}, {type: 'productModule'}],
      group: 'content',
    }),
    defineField({
      name: 'shipping',
      title: 'Shipping',
      type: 'text',
      group: 'settings',
      rows: 3,
    }),
    defineField({
      name: 'returns',
      title: 'Returns',
      type: 'text',
      group: 'settings',
      rows: 3,
    }),
    defineField({
      name: 'payment',
      title: 'Payment',
      type: 'text',
      group: 'settings',
      rows: 3,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Shop',
      }
    },
  },
})
