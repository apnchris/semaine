import {defineField} from 'sanity'

export const personFields = [
  defineField({
    name: 'name',
    title: 'Name',
    type: 'string',
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'slug',
    title: 'Slug',
    type: 'slug',
    options: {
      source: 'name',
      maxLength: 96,
    },
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'title',
    title: 'Title',
    type: 'string',
  }),
  defineField({
    name: 'signature',
    title: 'Signature',
    type: 'image',
    options: {
      hotspot: true,
    },
  }),
  defineField({
    title: 'Filters',
    name: 'filters',
    type: 'array',
    of: [
      {
        type: 'reference',
        to: [{type: 'category'}],
      },
    ],
  }),
  defineField({
    name: 'picture',
    title: 'Picture',
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
    name: 'excerpt',
    title: 'Excerpt',
    type: 'text',
    rows: 4
  }),
]
