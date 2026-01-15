import {accordionGroupType} from './objects/module/accordionGroupType'
import {accordionType} from './objects/module/accordionType'
import {calloutType} from './objects/module/calloutType'
import {callToActionType} from './objects/module/callToActionType'
import {collectionGroupType} from './objects/collection/collectionGroupType'
import {collectionLinksType} from './objects/collection/collectionLinksType'
import {collectionReferenceType} from './objects/module/collectionReferenceType'
import {collectionRuleType} from './objects/shopify/collectionRuleType'
import {customProductOptionColorObjectType} from './objects/customProductOption/customProductOptionColorObjectType'
import {customProductOptionColorType} from './objects/customProductOption/customProductOptionColorType'
import {customProductOptionSizeObjectType} from './objects/customProductOption/customProductOptionSizeObjectType'
import {customProductOptionSizeType} from './objects/customProductOption/customProductOptionSizeType'
import {footerType} from './objects/global/footerType'
import {gridItemType} from './objects/module/gridItemType'
import {gridType} from './objects/module/gridType'
import {gridGuide} from './objects/module/gridGuide'
import {gridShop} from './objects/module/gridShop'
import {heroType} from './objects/module/heroType'
import {imageCallToActionType} from './objects/module/imageCallToActionType'
import {imageFeaturesType} from './objects/module/imageFeaturesType'
import {imageFeatureType} from './objects/module/imageFeatureType'
import {imageWithProductHotspotsType} from './objects/hotspot/imageWithProductHotspotsType'
import {instagramType} from './objects/module/instagramType'
import {inventoryType} from './objects/shopify/inventoryType'
import {linkEmailType} from './objects/link/linkEmailType'
import {linkExternalType} from './objects/link/linkExternalType'
import {linkInternalType} from './objects/link/linkInternalType'
import {linkCreditsType} from './objects/link/linkCredits'
import {linkTitle} from './objects/link/linkTitle'
import {linkGroup} from './objects/link/linkGroup'
import {linkProductType} from './objects/link/linkProductType'
import {menuLinksType} from './objects/global/menuLinksType'
import {menuType} from './objects/global/menuType'
import {notFoundPageType} from './objects/global/notFoundPageType'
import {optionType} from './objects/shopify/optionType'
import {placeholderStringType} from './objects/shopify/placeholderStringType'
import {priceRangeType} from './objects/shopify/priceRangeType'
import {productFeaturesType} from './objects/module/productFeaturesType'
import {productHotspotsType} from './objects/hotspot/productHotspotsType'
import {productReferenceType} from './objects/module/productReferenceType'
import {productWithVariantType} from './objects/shopify/productWithVariantType'
import {proxyStringType} from './objects/shopify/proxyStringType'
import {seoType} from './objects/seoType'
import {shopifyCollectionType} from './objects/shopify/shopifyCollectionType'
import {shopifyProductType} from './objects/shopify/shopifyProductType'
import {shopifyProductVariantType} from './objects/shopify/shopifyProductVariantType'
import {shopType} from './objects/shopify/shopType'
import {spotType} from './objects/hotspot/spotType'
import {picksModule} from './objects/module/picks'
import {productModule} from './objects/module/productModule'


// Objects used as annotations must be imported first
const annotations = [linkEmailType, linkExternalType, linkInternalType, linkProductType, linkTitle, linkGroup, linkCreditsType]

const objects = [
  accordionGroupType,
  accordionType,
  calloutType,
  callToActionType,
  collectionGroupType,
  collectionLinksType,
  collectionReferenceType,
  collectionRuleType,
  customProductOptionColorObjectType,
  customProductOptionColorType,
  customProductOptionSizeObjectType,
  customProductOptionSizeType,
  footerType,
  gridItemType,
  gridType,
  gridGuide,
  gridShop,
  heroType,
  imageCallToActionType,
  imageFeaturesType,
  imageFeatureType,
  imageWithProductHotspotsType,
  instagramType,
  inventoryType,
  menuLinksType,
  menuType,
  notFoundPageType,
  optionType,
  placeholderStringType,
  priceRangeType,
  productFeaturesType,
  productHotspotsType,
  productReferenceType,
  productWithVariantType,
  proxyStringType,
  seoType,
  shopifyCollectionType,
  shopifyProductType,
  shopifyProductVariantType,
  shopType,
  spotType,
  picksModule,
  productModule
]

import {portableTextType} from './portableText/portableTextType'
import {portableTextSimpleType} from './portableText/portableTextSimpleType'

const blocks = [portableTextType, portableTextSimpleType]

import {collectionType} from './documents/collection'
import {colorThemeType} from './documents/colorTheme'
import {pageType} from './documents/page'
import {productType} from './documents/product'
import {productVariantType} from './documents/productVariant'


import {tasteMaker} from './documents/tasteMaker'
import {tasteBreaker} from './documents/tasteBreaker'
import {interest} from './documents/interest'
import {location} from './documents/location'
import {category} from './documents/category'
import {learnEntry} from './documents/learnEntry'
import {event} from './documents/event'
import {guide} from './documents/guide'

const documents = [
  collectionType,
  colorThemeType,
  pageType,
  productType,
  productVariantType,
  tasteMaker,
  tasteBreaker,
  interest,
  location,
  category,
  learnEntry,
  event,
  guide
]

import {homeType} from './singletons/homeType'
import {settingsType} from './singletons/settingsType'
import {tasteMakers} from './singletons/tasteMakers'
import {learn} from './singletons/learn'
import {guidePage} from './singletons/guidePage'
import {shopPage} from './singletons/shopPage'

const singletons = [
  homeType,
  settingsType,
  tasteMakers,
  learn,
  guidePage,
  shopPage
]

export const schemaTypes = [...annotations, ...objects, ...singletons, ...blocks, ...documents]
