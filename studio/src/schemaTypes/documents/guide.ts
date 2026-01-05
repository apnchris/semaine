import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const guide = defineType({
  name: 'guide',
  title: 'Guide',
  icon: UserIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured image',
      type: 'image',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
        }),
      ],
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
    }),
    defineField({
      title: 'Address',
      name: 'address',
      type: 'text',
      rows: 2
    }),
    defineField({
      title: 'Location',
      name: 'location',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'location'}],
        },
      ],
    }),
    defineField({
      title: 'Interest',
      name: 'interest',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'interest'}],
        },
      ],
    }),
    defineField({
      title: 'TasteMaker/Breaker',
      name: 'tasteMakerBreaker',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'tasteMaker'}, {type: 'tasteBreaker'}],
        },
      ],
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      rows: 4
    }),
  ],
  preview: {
    select: {
      title: 'title',
      featuredImage: 'featuredImage',
    },
    prepare(selection) {
      return {
        title: `${selection.title}`,
        subtitle: 'Guide',
        media: selection.featuredImage,
      }
    },
  },
})
