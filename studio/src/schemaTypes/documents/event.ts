import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Event',
  icon: UserIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'text',
      rows: 2,
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
      name: 'dateTime',
      title: 'Date and Time',
      type: 'datetime',
    }),
    defineField({
      name: 'dateTimeEnd',
      title: 'Date and Time (End)',
      description: 'Optional end date and time for the event',
      type: 'datetime',
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
      name: 'button',
      title: 'Button',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
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
        subtitle: 'Event',
        media: selection.featuredImage,
      }
    },
  },
})
