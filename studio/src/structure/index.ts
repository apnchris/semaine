import {CogIcon, FolderIcon, PackageIcon} from '@sanity/icons'
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
  'tasteMakers',
  'tasteMaker',
  'tasteBreaker',
  'product',
  'colorTheme',
  'collection',
  'productVariant',
  'home',
  'page',
  'interest',
  'location',
  'category',
]

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Settings')
        .child(S.document().schemaType('settings').documentId('siteSettings'))
        .icon(CogIcon),
      S.listItem()
        .title('Interests')
        .child(S.documentTypeList('interest').title('Interests'))
        .icon(FolderIcon),
      S.listItem()
        .title('Locations')
        .child(S.documentTypeList('location').title('Locations'))
        .icon(FolderIcon),
      S.listItem()
        .title('Categories')
        .child(S.documentTypeList('category').title('Categories'))
        .icon(FolderIcon),

      S.divider(),

      S.listItem()
        .title('TasteMakers')
        .child(S.documentTypeList('tasteMaker').title('Taste Makers'))
        .icon(FolderIcon),
      S.listItem()
        .title('TasteBreakers')
        .child(S.documentTypeList('tasteBreaker').title('Taste Breakers'))
        .icon(FolderIcon),
      S.listItem()
        .title('Products')
        .child(S.documentTypeList('product').title('Products'))
        .icon(PackageIcon),

      // Other document types
      ...S.documentTypeListItems()
        .filter((listItem: any) => !DISABLED_TYPES.includes(listItem.getId()))
        .map((listItem) => {
          return listItem.title(pluralize(listItem.getTitle() as string))
        }),
      
      S.divider(),

      S.listItem()
        .title('TasteMakers and TasteBreakers')
        .child(S.document().schemaType('tasteMakers').documentId('tasteMakers'))
        .icon(FolderIcon),

      S.divider(),
    ])
