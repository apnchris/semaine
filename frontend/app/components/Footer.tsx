import {settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import Link from 'next/link'
import {PortableText} from '@portabletext/react'

const portableTextComponents = {
  marks: {
    linkExternal: ({value, children}: any) => {
      const {url, newWindow} = value
      return (
        <a
          href={url}
          target={newWindow ? '_blank' : '_self'}
          rel={newWindow ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      )
    },
    linkInternal: ({value, children}: any) => {
      const {url} = value
      return <Link href={url || '/'}>{children}</Link>
    },
  },
}

export default async function Footer() {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
  })

  const footer = settings?.footer
  const currentYear = new Date().getFullYear()

  if (!footer?.links || footer.links.length === 0) {
    return null
  }

  return (
    <footer>
      <menu className='main-grid font-xs'>
        {footer.links.map((group: any, index: number) => (
          <li key={index}>
            <h3>
              {group.title}
            </h3>
            {group.links && group.links.length > 0 && (
              <ul>
                {group.links.map((link: any, linkIndex: number) => (
                  <li key={linkIndex}>
                    {link._type === 'linkCredits' ? (
                      <div className='footer-credits'>
                        {link.title && <h4 className='footer-credits-title'>{link.title}</h4>}
                        {link.credits && (
                          <div className='footer-credits-content'>
                            <PortableText value={link.credits} components={portableTextComponents} />
                          </div>
                        )}
                      </div>
                    ) : link._type === 'linkExternal' ? (
                      <a
                        href={link.url}
                        target={link.newWindow ? '_blank' : '_self'}
                        rel={link.newWindow ? 'noopener noreferrer' : undefined}
                      >
                        {link.text}
                      </a>
                    ) : (
                      <Link
                        href={link.url || '/'}
                      >
                        {link.text}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}

        <li className='footer-newsletter'>
          <div>
            <h3>
              Newsletter
            </h3>
            <p className='serif font-sm'>
              {footer.newsletterText}
            </p>
          </div>

          <form
            action="https://semaine.us1.list-manage.com/subscribe/post?u=5f7e1f6f2f7f4e5f6f7f6f7f6&amp;id=1234567890"
            method="post"
            target="_blank"
            noValidate
          >
            <input
              type="email"
              name="EMAIL"
              placeholder="Email"
              required
            />
            <button type="submit">
              Join
            </button>
          </form>
        </li>

        <li className='footer-copyright'>
          ©{currentYear} Semaine
        </li>
      </menu>
    </footer>
  )
}
