import {PinIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const location = defineType({
  name: 'location',
  title: 'Location',
  type: 'document',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'city',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string'
    }),
  ],
  preview: {
    select: {
      title: 'city',
    },
  },
})
