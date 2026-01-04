'use client'

import {useEffect} from 'react'

export default function ScrollBottomDetector() {
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      
      // Check if user is at or near the bottom (within 10px threshold)
      const isAtBottom = windowHeight + scrollTop >= documentHeight - 25
      
      if (isAtBottom) {
        document.body.classList.add('at-bottom')
      } else {
        document.body.classList.remove('at-bottom')
      }
    }

    // Run on mount to check initial position
    handleScroll()

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, {passive: true})

    // Cleanup on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return null
}
