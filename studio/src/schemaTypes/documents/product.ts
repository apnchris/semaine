import {PackageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  icon: PackageIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'shopifyId',
      title: 'Shopify Product ID',
      type: 'string',
      description: 'The Shopify product ID (e.g., gid://shopify/Product/123456789)',
      readOnly: true,
    }),
    defineField({
      name: 'handle',
      title: 'Handle',
      type: 'string',
      description: 'The Shopify product handle (URL slug)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier for this product page',
      options: {
        source: 'handle',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title Override',
      type: 'string',
      description: 'Optional: Override the Shopify product title',
    }),
    defineField({
      name: 'description',
      title: 'Editorial Description',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Additional editorial content about this product',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      description: 'Optional: Override the Shopify product image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
        }),
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      description: 'Mark this product as featured on the homepage',
      initialValue: false,
    }),
    defineField({
      name: 'tasteMakers',
      title: 'Associated Tastemakers',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'tasteMaker'}],
        },
      ],
      description: 'Tastemakers who recommend or feature this product',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          type: 'string',
          title: 'Meta Title',
        }),
        defineField({
          name: 'metaDescription',
          type: 'text',
          title: 'Meta Description',
          rows: 3,
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      handle: 'handle',
      media: 'featuredImage',
      featured: 'featured',
    },
    prepare(selection) {
      const {title, handle, media, featured} = selection
      return {
        title: title || handle,
        subtitle: featured ? '⭐ Featured Product' : 'Product',
        media,
      }
    },
  },
})
