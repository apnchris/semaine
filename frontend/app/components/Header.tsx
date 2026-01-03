import Link from 'next/link'
import {settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import HeaderActions from './HeaderActions'

export default async function Header() {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
  })

  return (
    <header>
        <div className="flex items-center justify-between gap-5">

          <nav>
            <ul
              role="list"
              className="nav-list"
            >
              <li className='nav-li'>
                <Link href="/about" className="nav-link">
                  About
                </Link>
              </li>
            </ul>
          </nav>

          <HeaderActions />
        </div>
    </header>
  )
}
