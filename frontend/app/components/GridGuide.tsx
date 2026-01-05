import GuideCard from '@/app/components/GuideCard'
import styles from '../css/components/gridGuide.module.css'

interface Guide {
  _id: string
  _type: 'guide'
  title: string
  slug: {
    current: string
  }
  address?: string
  message?: string
  featuredImage?: {
    asset: {
      _id: string
      url: string
    }
    alt?: string
  }
}

interface GridGuideProps {
  guides?: Guide[]
}

export default function GridGuide({guides}: GridGuideProps) {
  if (!guides || guides.length === 0) return null

  return (
    <div className={`main-grid ${styles.gridGuide}`}>
      {guides.map((guide) => (
        <GuideCard key={guide._id} guide={guide}/>
      ))}
    </div>
  )
}
