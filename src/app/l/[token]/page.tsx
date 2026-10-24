'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { LinkIcon, MessageCircle } from 'lucide-react'
import Loader from '@/components/ui/Loader'
import { WHATSAPP_URL } from '@/lib/contact'

// A sign-in link from Valeron: /l/<token>. Exchanges the token for a session and
// goes to the auction list. The token never stays in the address bar.

export default function LinkSignInPage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const [failed, setFailed] = useState(false)
  const started = useRef(false)

  useEffect(() => {
    // StrictMode runs effects twice in development; sign in once.
    if (started.current) return
    started.current = true
    signIn('link', { token: params.token, redirect: false }).then((res) => {
      if (res?.ok && !res.error) router.replace('/auctions')
      else {
        window.history.replaceState(null, '', '/auth/signin')
        setFailed(true)
      }
    })
  }, [params.token, router])

  if (!failed) return <Loader label="Opening your auction list" />

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-xl text-center">
        <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
          <LinkIcon className="w-7 h-7 text-slate-700" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 mb-2">This link isn&apos;t working</h1>
        <p className="text-slate-500 mb-6">
          It may have expired or been replaced with a newer one. Message us and we&apos;ll send you a fresh link.
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full inline-flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Ask on WhatsApp
        </a>
        <Link href="/" className="block mt-4 text-sm text-slate-500 hover:text-slate-800">Back to Home</Link>
      </div>
    </div>
  )
}
