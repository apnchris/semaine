import './css/commons/variables.css'
import './css/commons/globals.css'
import './css/commons/main.css'

import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata} from 'next'
import {Inter, IBM_Plex_Mono} from 'next/font/google'
import {draftMode} from 'next/headers'
import {toPlainText} from 'next-sanity'
import {VisualEditing} from 'next-sanity/visual-editing'
import {Toaster} from 'sonner'

import DraftModeToast from '@/app/components/DraftModeToast'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
import Link from 'next/link'
import Logo from '@/app/components/Logo'
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
  const {isEnabled: isDraftMode} = await draftMode()

  return (
    <html lang="en" className={baikal.className}>
      <body>
        <CartProvider>
          <section>
            {/* The <Toaster> component is responsible for rendering toast notifications used in /app/client-utils.ts and /app/components/DraftModeToast.tsx */}
            <Toaster />
            {isDraftMode && (
              <>
                <DraftModeToast />
                {/*  Enable Visual Editing, only to be rendered when Draft Mode is enabled */}
                <VisualEditing />
              </>
            )}
            {/* The <SanityLive> component is responsible for making all sanityFetch calls in your application live, so should always be rendered. */}
            <SanityLive onError={handleError} />

            <Link className="logo" href="/">
              <Logo />
            </Link>
            <Header />
            <main className="">{children}</main>
            <Footer />
          </section>
          <SpeedInsights />
        </CartProvider>
      </body>
    </html>
  )
}
