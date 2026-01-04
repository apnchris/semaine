import {defineField} from 'sanity'

export const footerType = defineField({
  name: 'footerSettings',
  title: 'Footer',
  type: 'object',
  options: {
    collapsed: false,
    collapsible: true,
  },
  fields: [
    defineField({
      name: 'links',
      type: 'array',
      of: [{type: 'linkGroup'}],
    }),
    defineField({
      name: 'newsletterText',
      type: 'text',
      title: 'Newsletter Text',
      rows: 3,
    }),
  ],
})
