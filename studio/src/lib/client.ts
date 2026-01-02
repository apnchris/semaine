import {client as sanityClient} from 'sanity'

// Create a Sanity client for server-side operations
export const client = sanityClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_STUDIO_API_TOKEN || '',
  useCdn: false,
})
