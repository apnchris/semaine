import {HeartIcon} from '@/app/components/Vectors'

interface FavoriteButtonProps {
  className?: string
}

export default function FavoriteButton({className}: FavoriteButtonProps) {

  return (
    <button className={`favorite-button blur-back ${className || ''}`}>
      <HeartIcon />
    </button>
  )
}
