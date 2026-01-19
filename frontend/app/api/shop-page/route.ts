import {NextResponse} from 'next/server'
import {client} from '@/sanity/lib/client'

export async function GET() {
  try {
    const shopPage = await client.fetch(`
      *[_type == "shopPage"][0] {
        shipping,
        returns,
        payment
      }
    `)

    return NextResponse.json(shopPage || null)
  } catch (error) {
    console.error('Failed to fetch shopPage:', error)
    return NextResponse.json(
      {error: 'Failed to fetch shop page data'},
      {status: 500}
    )
  }
}
