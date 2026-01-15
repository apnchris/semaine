'use client'

import {useEffect} from 'react'

interface HideFooterProps {
  pageType?: string
}

export default function HideFooter({pageType}: HideFooterProps) {
  useEffect(() => {
    if (pageType) {
      document.body.classList.add(`page-${pageType}`)
      
      return () => {
        document.body.classList.remove(`page-${pageType}`)
      }
    }
    
    // Default scroll bottom detection for all other pages
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      
      const isAtBottom = windowHeight + scrollTop >= documentHeight - 25
      
      if (isAtBottom) {
        document.body.classList.add('at-bottom')
      } else {
        document.body.classList.remove('at-bottom')
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, {passive: true})

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.body.classList.remove('at-bottom')
    }
  }, [pageType])

  return null
}
