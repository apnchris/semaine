import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const learn = defineType({
  name: 'learn',
  title: 'Learn',
  icon: UserIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string'
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text'
    }),
    defineField({
      title: 'Filters',
      name: 'filters',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            {type: 'category'}
          ]
        }
      ]
    }),
    defineField({
      title: 'Entries',
      name: 'entries',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            {type: 'learnEntry'}
          ]
        }
      ]
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Learn',
      }
    },
  },
})
