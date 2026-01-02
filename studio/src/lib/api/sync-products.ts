import {NextResponse} from 'next/server'
import {syncShopifyProducts} from './syncLib'

export async function POST() {
  try {
    const results = await syncShopifyProducts()
    return NextResponse.json(results)
  } catch (error: any) {
    console.error('Sync error:', error)
    return NextResponse.json({error: error.message}, {status: 500})
  }
}
