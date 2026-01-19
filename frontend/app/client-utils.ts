'use client'

import {isCorsOriginError} from 'next-sanity/live'
import {toast} from 'sonner'

/**
 * Formats a price number to remove trailing zeros when there are no decimals
 * @param price - The price as a number or string
 * @returns The formatted price string without trailing zeros
 */
export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  // Convert to string and remove trailing zeros after decimal point
  // This will turn "10.00" into "10", "10.50" into "10.5", but keep "100" as "100"
  return numPrice.toString().replace(/\.0+$/, '')
}

export function handleError(error: unknown) {
  if (isCorsOriginError(error)) {
    // If the error is a CORS origin error, let's display that specific error.
    const {addOriginUrl} = error
    toast.error(`Sanity Live couldn't connect`, {
      description: `Your origin is blocked by CORS policy`,
      duration: Infinity,
      action: addOriginUrl
        ? {
            label: 'Manage',
            onClick: () => window.open(addOriginUrl.toString(), '_blank'),
          }
        : undefined,
    })
  } else if (error instanceof Error) {
    console.error(error)
    toast.error(error.name, {description: error.message, duration: Infinity})
  } else {
    console.error(error)
    toast.error('Unknown error', {
      description: 'Check the console for more details',
      duration: Infinity,
    })
  }
}
