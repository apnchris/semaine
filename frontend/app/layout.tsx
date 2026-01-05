import './css/commons/variables.css'
import './css/commons/globals.css'
import './css/commons/main.css'
import './css/commons/nav.css'
import './css/commons/filters.css'

import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {toPlainText} from 'next-sanity'
import {VisualEditing} from 'next-sanity/visual-editing'
import {Toaster} from 'sonner'

import DraftModeToast from '@/app/components/DraftModeToast'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
import Link from 'next/link'
import {Logo} from '@/app/components/Vectors'
import CartOverlay from '@/app/components/CartOverlay'
import ScrollBottomDetector from '@/app/components/ScrollBottomDetector'
import {CartProvider} from '@/app/context/CartContext'
import * as demo from '@/sanity/lib/demo'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'
import {handleError} from '@/app/client-utils'

import localFont from 'next/font/local'
const baikal = localFont({
  src: [
    {
      path: '../public/fonts/BaikalTrial-Book.woff2',
      weight: '340',
      style: 'normal',
    },
    {
      path: '../public/fonts/BaikalTrial-BookItalic.woff2',
      weight: '340',
      style: 'italic',
    },
    {
      path: '../public/fonts/BaikalTrial-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/BaikalTrial-SemiBoldItalic.woff2',
      weight: '600',
      style: 'italic',
    },
  ]
})
const marlfield = localFont({
  src: [
    {
      path: '../public/fonts/TRIAL_OTT_Marlfield-Bold.woff2',
      style: 'normal',
    },
  ],
  variable: '--font-marlfield',
})

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(): Promise<Metadata> {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  })
  const title = settings?.title || demo.title
  const description = settings?.description || demo.description

  const ogImage = resolveOpenGraphImage(settings?.ogImage)
  let metadataBase: URL | undefined = undefined
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  }
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${baikal.className} ${marlfield.variable}`}>
      <body>
        <ScrollBottomDetector />
        <CartProvider>
          <section>
            <SanityLive onError={handleError} />

            <Link className="logo" href="/">
              <Logo />
            </Link>
            <Header />
            <main className="">{children}</main>
            <Footer />
            <CartOverlay />
          </section>
          <SpeedInsights />
        </CartProvider>
      </body>
    </html>
  )
}
