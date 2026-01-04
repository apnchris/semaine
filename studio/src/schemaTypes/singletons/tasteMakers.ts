import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const tasteMakers = defineType({
  name: 'tasteMakers',
  title: 'TasteMakers',
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
      title: 'TasteMakers and TasteBreakers',
      name: 'tasteMakersAndTasteBreakers',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            {type: 'tasteMaker'},
            {type: 'tasteBreaker'}
          ]
        }
      ]
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'TasteMakers',
      }
    },
  },
})
