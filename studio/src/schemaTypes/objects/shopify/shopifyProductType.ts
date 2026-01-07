import {defineArrayMember, defineField} from 'sanity'

export const shopifyProductType = defineField({
  name: 'shopifyProduct',
  title: 'Shopify',
  type: 'object',
  options: {
    collapsed: false,
    collapsible: true,
  },
  readOnly: true,
  fieldsets: [
    {
      name: 'status',
      title: 'Status',
    },
    {
      name: 'organization',
      title: 'Organization',
      options: {
        columns: 2,
      },
    },
    {
      name: 'variants',
      title: 'Variants',
      options: {
        collapsed: true,
        collapsible: true,
      },
    },
  ],
  fields: [
    defineField({
      fieldset: 'status',
      name: 'createdAt',
      type: 'string',
    }),
    defineField({
      fieldset: 'status',
      name: 'updatedAt',
      type: 'string',
    }),
    defineField({
      fieldset: 'status',
      name: 'status',
      type: 'string',
      options: {
        layout: 'dropdown',
        list: ['active', 'archived', 'draft'],
      },
    }),
    defineField({
      fieldset: 'status',
      name: 'isDeleted',
      title: 'Deleted from Shopify?',
      type: 'boolean',
    }),
    defineField({
      name: 'title',
      type: 'string',
      description: 'Title displayed in both cart and checkout',
    }),
    defineField({
      name: 'id',
      title: 'ID',
      type: 'number',
      description: 'Shopify Product ID',
    }),
    defineField({
      name: 'gid',
      title: 'GID',
      type: 'string',
      description: 'Shopify Product GID',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      description: 'Shopify Product handle',
    }),
    defineField({
      name: 'shop',
      type: 'shop',
      description: 'Shopify shop information',
    }),
    defineField({
      name: 'descriptionHtml',
      title: 'HTML Description',
      type: 'text',
      rows: 5,
    }),
    defineField({
      fieldset: 'organization',
      name: 'productType',
      type: 'string',
    }),
    defineField({
      fieldset: 'organization',
      name: 'vendor',
      type: 'string',
    }),
    defineField({
      fieldset: 'organization',
      name: 'tags',
      type: 'string',
    }),
    defineField({
      name: 'priceRange',
      type: 'priceRange',
    }),
    defineField({
      name: 'previewImageUrl',
      title: 'Preview Image URL',
      type: 'string',
      description: 'Image displayed in both cart and checkout',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      description: 'All product images from Shopify',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'altText',
              type: 'string',
            }),
            defineField({
              name: 'id',
              type: 'string',
            }),
            defineField({
              name: 'url',
              type: 'string',
            }),
            defineField({
              name: 'src',
              type: 'string',
            }),
            defineField({
              name: 'originalSrc',
              type: 'string',
            }),
            defineField({
              name: 'width',
              type: 'number',
            }),
            defineField({
              name: 'height',
              type: 'number',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'options',
      type: 'array',
      of: [{type: 'option'},
      ],
    }),
    defineField({
      name: 'metafields',
      title: 'Metafields',
      type: 'object',
      description: 'Product metafields from Shopify',
      fields: [
        defineField({
          name: 'details_03',
          title: 'Details 01',
          type: 'text',
          description: 'data.details_01 metafield',
        }),
        defineField({
          name: 'details_04',
          title: 'Details 02',
          type: 'text',
          description: 'data.details_02 metafield',
        }),
      ],
    }),
    defineField({
      fieldset: 'variants',
      name: 'variants',
      type: 'array',
      of: [
        defineArrayMember({
          title: 'Variant',
          type: 'reference',
          weak: true,
          to: [{type: 'productVariant'}],
        }),
      ],
    }),
  ],
})
