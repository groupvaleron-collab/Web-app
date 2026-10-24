import type { Metadata } from 'next'

// The sign-in token is in this page's URL: never send it on as a Referer, and
// keep the page out of search results.
export const metadata: Metadata = {
  title: 'Opening your auction list | Valeron Automart',
  referrer: 'no-referrer',
  robots: { index: false, follow: false },
}

export default function LinkLayout({ children }: { children: React.ReactNode }) {
  return children
}
