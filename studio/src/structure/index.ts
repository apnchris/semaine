import {CogIcon, FolderIcon, PackageIcon, RefreshIcon} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import pluralize from 'pluralize-esm'

/**
 * Structure builder is useful whenever you want to control how documents are grouped and
 * listed in the studio or for adding additional in-studio previews or content to documents.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

const DISABLED_TYPES = [
  'settings',
  'assist.instruction.context',
  'tasteMaker',
  'tasteBreaker',
  'product',
  'shopifySync',
]

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Website Content')
    .items([
      S.listItem()
        .title('Taste Makers')
        .child(S.documentTypeList('tasteMaker').title('Taste Makers'))
        .icon(FolderIcon),
      S.listItem()
        .title('Taste Breakers')
        .child(S.documentTypeList('tasteBreaker').title('Taste Breakers'))
        .icon(FolderIcon),
      S.listItem()
        .title('Products')
        .child(S.documentTypeList('product').title('Products'))
        .icon(PackageIcon),
      
      S.divider(),

      // Shopify Sync
      S.listItem()
        .title('Sync Shopify Products')
        .child(S.document().schemaType('shopifySync').documentId('shopifySync'))
        .icon(RefreshIcon),
      
      S.divider(),

      // Other document types
      ...S.documentTypeListItems()
        .filter((listItem: any) => !DISABLED_TYPES.includes(listItem.getId()))
        .map((listItem) => {
          return listItem.title(pluralize(listItem.getTitle() as string))
        }),

      S.divider(),
      
      // Settings
      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('settings').documentId('siteSettings'))
        .icon(CogIcon),
    ])
