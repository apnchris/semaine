import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const tasteMaker = defineType({
  name: 'tasteMaker',
  title: 'Taste Maker',
  icon: UserIcon,
  type: 'document',
  fields: [
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
      // validation: (rule) => rule.required(),
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
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.picture as any)?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            })
          },
        }),
      ],
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      // validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      name: 'name',
      title: 'title',
      picture: 'picture',
    },
    prepare(selection) {
      return {
        title: `${selection.name}`,
        subtitle: 'Taste Maker',
        media: selection.picture,
      }
    },
  },
})
