import {UserIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export const picksModule = defineField({
  name: 'picksModule',
  title: 'Picks',
  type: 'object',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string'
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
      name: 'colorOne',
      title: 'Color 01',
      type: 'color',
    }),
    defineField({
      name: 'colorTwo',
      title: 'Color 02',
      type: 'color',
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
      title: 'Custom Curator',
      name: 'customCurator',
      type: 'object',
      fields: [
        {
          name: 'from',
          type: 'text',
          title: 'From',
          rows: 2
        },
        {
          name: 'curator',
          type: 'text',
          title: 'Curator',
          rows: 2
        }
      ]
    }),
    defineField({
      name: 'links',
      type: 'array',
      of: [
        {
          title: 'Item',
          name: 'item',
          type: 'object',
          fields: [
            {
              title: 'Items',
              name: 'items',
              type: 'array',
              of: [
                {
                  type: 'reference',
                  to: [{type: 'product'}, {type: 'guide'}],
                },
              ],
              validation: (Rule) => Rule.max(1),
            },
            {
              name: 'message',
              type: 'text',
              title: 'Message',
              rows: 3
            }
          ],
          preview: {
            select: {
              title: 'items.0.store.title',
              guideTitle: 'items.0.title',
              productImageUrl: 'items.0.store.previewImageUrl',
              guideImage: 'items.0.featuredImage',
              message: 'message',
            },
            prepare(selection) {
              const {title, guideTitle, productImageUrl, guideImage, message} = selection
              const displayTitle = title || guideTitle || 'No item selected'
              
              return {
                title: displayTitle,
                subtitle: message || 'No message',
                media: guideImage,
                imageUrl: productImageUrl,
              }
            },
          },
        }
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      picture: 'picture',
    },
    prepare(selection) {
      return {
        title: selection.title,
        media: selection.picture,
      }
    },
  },
})
