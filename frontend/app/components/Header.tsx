import Link from 'next/link'
import {settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import CartTrigger from './CartTrigger'
import NavLink from './NavLink'

export default async function Header() {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
  })

  return (
    <header className='blur-back'>
      <nav>
        <menu
          role="list"
          className="nav-list"
        >
          <li className='nav-li'>
            <NavLink href="/">
              Highlights
            </NavLink>
          </li>

          <li className='nav-li'>
            <NavLink href="/products">
              Shop
            </NavLink>
          </li>

          <li className='nav-li'>
            <NavLink href="/tastemakers">
              Taste
              <span className="nav-link-makers-breakers">
                <span>Makers</span>
                <span>Breakers</span>
              </span>
            </NavLink>
          </li>

          <li className='nav-li'>
            <NavLink href="/learn">
              Learn
            </NavLink>
          </li>

          <li className='nav-li'>
            <NavLink href="/guide">
              Guide
            </NavLink>
          </li>

          <li className='nav-li'>
            <NavLink href="/events">
              Events
            </NavLink>
          </li>

          <li className='nav-li nav-li-customer'>
            <ul>
              <li className='nav-li'>
                <button className='nav-link account-trigger'>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M9.50882 7.78012C10.8947 7.09087 11.8421 5.71425 11.8421 4.125C11.8421 1.84688 9.89803 0 7.5 0C5.10197 0 3.15789 1.84688 3.15789 4.125C3.15789 5.71425 4.10526 7.09087 5.49118 7.78012C2.325 8.65875 0 11.5534 0 15H15C15 11.5534 12.675 8.65875 9.50882 7.78012ZM3.94737 4.125C3.94737 2.26388 5.54092 0.75 7.5 0.75C9.45908 0.75 11.0526 2.26388 11.0526 4.125C11.0526 5.98612 9.45908 7.5 7.5 7.5C5.54092 7.5 3.94737 5.98612 3.94737 4.125ZM7.5 8.25C10.948 8.25 13.7972 10.8799 14.1695 14.25H0.830526C1.20276 10.8799 4.05197 8.25 7.5 8.25Z" fill="black"/>
                  </svg>
                </button>
              </li>

              <li className='nav-li'>
                <button className='nav-link favorite-trigger'>
                  <svg width="17" height="15" viewBox="0 0 17 15" fill="none">
                    <path d="M1.8887 8.57143L8.5 15L15.1113 8.57143C16.2588 7.70014 17 6.31886 17 4.76186C17 2.13343 14.8844 0 12.2778 0C10.7338 0 9.35935 0.752572 8.5 1.90971C7.64065 0.752572 6.2662 0 4.72218 0C2.11565 0 0 2.13343 0 4.76186C0 6.31886 0.7412 7.70014 1.8887 8.57143ZM4.72218 0.857143C5.93342 0.857143 7.09113 1.44257 7.81958 2.42314L8.5 3.33943L9.18043 2.42357C9.90888 1.44257 11.0666 0.857143 12.2778 0.857143C14.413 0.857143 16.15 2.60871 16.15 4.76186C16.15 5.99957 15.5852 7.13871 14.5996 7.88657L14.5584 7.91786L14.521 7.95429L8.5 13.8094L2.47903 7.95429L2.44163 7.91786L2.4004 7.88657C1.41525 7.13871 0.85 5.99957 0.85 4.76186C0.85 2.60871 2.58698 0.857143 4.72218 0.857143Z" fill="black"/>
                  </svg>
                </button>
              </li>

              <li className='nav-li'>
                <CartTrigger />
              </li>
            </ul>
          </li>
        </menu>
      </nav>
    </header>
  )
}
