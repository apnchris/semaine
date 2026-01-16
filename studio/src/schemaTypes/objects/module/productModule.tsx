import {ThLargeIcon} from '@sanity/icons'
import {defineField} from 'sanity'
import ShopifyDocumentStatus from '../../../components/media/ShopifyDocumentStatus'

export const productModule = defineField({
  name: 'productModule',
  title: 'Product Module',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({
      title: 'Product',
      name: 'product',
      type: 'array',
      validation: (rule) => rule.max(1),
      of: [
        {
          type: 'reference',
          to: [
            {type: 'product'}
          ]
        }
      ]
    }),
  ],
  preview: {
    select: {
      title: 'product.0.store.title',
      previewImageUrl: 'product.0.store.previewImageUrl',
      status: 'product.0.store.status',
      isDeleted: 'product.0.store.isDeleted',
    },
    prepare(selection) {
      const {title, previewImageUrl, status, isDeleted} = selection
      return {
        title: title || 'No product selected',
        subtitle: 'Product Module',
        media: (
          <ShopifyDocumentStatus
            isActive={status === 'active'}
            isDeleted={isDeleted}
            type="product"
            url={previewImageUrl}
            title={title}
          />
        ),
      }
    },
  },
})
