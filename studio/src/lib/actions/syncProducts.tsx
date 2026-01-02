import {RefreshIcon} from '@sanity/icons'
import {useCallback, useState} from 'react'
import type {DocumentActionComponent} from 'sanity'
import {useClient} from 'sanity'

export const SyncProductsAction: DocumentActionComponent = (props) => {
  const {id, type, onComplete} = props
  const [isLoading, setIsLoading] = useState(false)
  const client = useClient({apiVersion: '2024-01-01'})

  const handleSync = useCallback(async () => {
    if (type !== 'shopifySync') return

    if (!confirm('This will sync all products from Shopify. Continue?')) {
      return
    }

    setIsLoading(true)

    try {
      console.log('Starting Shopify product sync...')
      
      // Get the preview URL from environment or use default
      const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'
      
      // Call the Next.js API route
      const response = await fetch(`${previewUrl}/api/sync-shopify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || `API error: ${response.status}`)
      }

      const results = await response.json()
      console.log('Sync results:', results)

      // Check if document exists, create if it doesn't
      const existingDoc = await client.fetch(`*[_id == $id][0]`, {id})
      
      if (!existingDoc) {
        // Create the document
        await client.create({
          _id: id,
          _type: 'shopifySync',
          title: 'Shopify Product Sync',
          lastSyncedAt: new Date().toISOString(),
          lastSyncResults: results,
        })
      } else {
        // Update existing document
        await client
          .patch(id)
          .set({
            lastSyncedAt: new Date().toISOString(),
            lastSyncResults: results,
          })
          .commit()
      }

      // Show detailed results including errors
      let message = `✅ Sync complete!\n\nCreated: ${results.created}\nUpdated: ${results.updated}\nErrors: ${results.errors}`
      
      if (results.errors > 0 && results.errorDetails && results.errorDetails.length > 0) {
        message += `\n\n❌ Error Details:\n${results.errorDetails.join('\n')}`
      }
      
      if (results.created === 0 && results.updated === 0 && results.errors > 0) {
        message += '\n\nCheck the Next.js terminal (port 3000) for detailed logs.'
      } else {
        message += '\n\nProducts are now available in the Products section.'
      }

      alert(message)

      onComplete()
    } catch (error: any) {
      console.error('Sync error:', error)
      
      let errorMessage = error.message || 'Unknown error'
      
      // Provide helpful error messages
      if (errorMessage.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to the frontend server. Make sure your Next.js app is running at http://localhost:3000'
      } else if (errorMessage.includes('Missing Shopify credentials')) {
        errorMessage += '\n\nPlease add SHOPIFY_ADMIN_API_TOKEN to frontend/.env.local'
      } else if (errorMessage.includes('401')) {
        errorMessage = 'Authentication failed. Please check your Shopify Admin API token.'
      } else if (errorMessage.includes('403')) {
        errorMessage = 'Access forbidden. Make sure your Shopify API token has read_products permission.'
      }
      
      alert(`❌ Sync failed:\n\n${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }, [type, id, client, onComplete])

  if (type !== 'shopifySync') {
    return null
  }

  return {
    label: isLoading ? 'Syncing Products...' : 'Sync Products from Shopify',
    icon: RefreshIcon,
    disabled: isLoading,
    onHandle: handleSync,
    tone: 'primary',
  }
}
