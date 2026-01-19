import {defineQuery} from 'next-sanity'

export const settingsQuery = defineQuery(`
  *[_type == "settings"][0]{
    ...,
    footer{
      links[]{
        title,
        links[]{
          _type,
          text,
          url,
          newWindow,
          _type == 'linkCredits' => {
            title,
            credits
          }
        }
      },
      newsletterText
    }
  }
`)

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
`

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current
  }
`

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        ...,
        button {
          ...,
          ${linkFields}
        }
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      },
    },
  }
`)

export const sitemapData = defineQuery(`
  *[_type == "page" || _type == "post" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`)

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`)

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`)

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
    ...,
    markDefs[]{
      ...,
      ${linkReference}
    }
  },
    ${postFields}
  }
`)

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`)

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`)

export const TASTEMAKER_QUERY = defineQuery(`
  *[(_type == "tasteMaker" || _type == "tasteBreaker") && slug.current == $slug][0] {
    _id,
    _type,
    name,
    title,
    picture {
      asset->,
      alt
    }
  }
`)

export const TASTEBREAKER_QUERY = defineQuery(`
  *[_type == "tasteBreaker" && slug.current == $slug][0] {
    _id,
    name,
    title,
    picture {
      asset->,
      alt
    }
  }
`)

export const allProductsQuery = defineQuery(`
  *[_type == "product" && !store.isDeleted] | order(store.title asc) {
    _id,
    _type,
    thumbSize,
    store {
      id,
      title,
      slug,
      status,
      previewImageUrl,
      priceRange {
        minVariantPrice,
        maxVariantPrice
      },
      productType,
      vendor,
      tags
    },
    seo {
      title,
      description
    }
  }
`)
