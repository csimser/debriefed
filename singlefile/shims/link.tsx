/**
 * next/link shim for the single-file build — renders a plain anchor whose
 * internal hrefs are converted to hash routes. Aliased in place of
 * 'next/link' by singlefile/vite.config.ts.
 */
import React, { forwardRef } from 'react'
import { toHash } from './navigation'

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  prefetch?: boolean
  scroll?: boolean
  shallow?: boolean
  replace?: boolean
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, prefetch: _p, scroll: _s, shallow: _sh, replace: _r, children, ...rest },
  ref,
) {
  return (
    <a ref={ref} href={toHash(href)} {...rest}>
      {children}
    </a>
  )
})

export default Link
