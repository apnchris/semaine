import {person} from './documents/person'
import {tasteMaker} from './documents/tasteMaker'
import {tasteBreaker} from './documents/tasteBreaker'
import {page} from './documents/page'
import {post} from './documents/post'
import {product} from './documents/product'
import {callToAction} from './objects/callToAction'
import {infoSection} from './objects/infoSection'
import {settings} from './singletons/settings'
import {shopifySync} from './singletons/shopifySync'
import {link} from './objects/link'
import {blockContent} from './objects/blockContent'
import button from './objects/button'
import {blockContentTextOnly} from './objects/blockContentTextOnly'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  shopifySync,
  // Documents
  page,
  post,
  person,
  tasteMaker,
  tasteBreaker,
  product,
  // Objects
  button,
  blockContent,
  blockContentTextOnly,
  infoSection,
  callToAction,
  link,
]
