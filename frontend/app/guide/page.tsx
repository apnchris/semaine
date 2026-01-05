import type {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'
import PicksModule from '@/app/components/PicksModule'
import GridGuide from '@/app/components/GridGuide'
import styles from '../css/pages/guide.module.css'

const GUIDE_PAGE_QUERY = defineQuery(`
  *[_type == "guidePage"][0] {
    title,
    modules[] {
      _type,
      _type == "picksModule" => {
        title,
        picture {
          asset->{
            _id,
            url
          },
          alt
        },
        tasteMakerBreaker[]->{
          _id,
          name,
          slug,
          _type
        },
        customCurator,
        links[] {
          items[]->{
            _id,
            _type,
            slug,
            title,
            _type == "product" => {
              store {
                title
              }
            },
            _type == "guide" => {
              address,
              location[]->{
                _id,
                city,
                country
              }
            },
            featuredImage {
              asset->{
                _id,
                url
              },
              alt
            }
          },
          message
        }
      },
      _type == "gridGuide" => {
        guides[]->{
          _id,
          _type,
          title,
          slug,
          address,
          message,
          location[]->{
            _id,
            city,
            country
          },
          featuredImage {
            asset->{
              _id,
              url
            },
            alt
          }
        }
      }
    }
  }
`)

export const metadata: Metadata = {
  title: 'Guide',
  description: 'Discover curated guides and recommendations',
}

export default async function GuidePage() {
  const {data: pageData} = await sanityFetch({
    query: GUIDE_PAGE_QUERY,
  })

  return (
    <div className={styles.guidePage}>
      {pageData?.title && (
        <div className={`${styles.intro} main-grid`}>
          <h1 className="font-l">{pageData.title}</h1>
        </div>
      )}

      {pageData?.modules?.map((module: any, index: number) => {
        if (module._type === 'picksModule') {
          return <PicksModule key={index} {...module} />
        }
        if (module._type === 'gridGuide') {
          return <GridGuide key={index} guides={module.guides} />
        }
        return null
      })}
    </div>
  )
}
