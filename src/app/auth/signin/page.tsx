'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Car, ArrowLeft, Sparkles, Shield, Zap, Link2, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { FormEvent, Suspense, useState } from 'react'
import Loader from '@/components/ui/Loader';
import { WHATSAPP_URL } from '@/lib/contact'

// Sign-in is by link only: Valeron sends each customer (or caller) a personal
// link, and opening it signs them in (/l/<token>). This page is for someone who
// arrived without it — paste the link here, or ask for one.

/** The token from a pasted link (…/l/<token>) or a bare token. */
function tokenFrom(input: string): string | null {
  const m = /(?:\/l\/)?([A-Za-z0-9_-]{43})\/?\s*$/.exec(input.trim())
  return m ? m[1] : null
}

function SignInContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get('error')
  const [pasted, setPasted] = useState('')
  const [pasteError, setPasteError] = useState('')

  const openPasted = (e: FormEvent) => {
    e.preventDefault()
    const token = tokenFrom(pasted)
    if (!token) return setPasteError('That doesn’t look like a Valeron link. Paste the whole link we sent you.')
    router.push(`/l/${token}`)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-900/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-900/5 rounded-full blur-[120px]" />
      
      <div className="relative w-full max-w-md z-10">
        {/* Back button */}
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white backdrop-blur-2xl rounded-3xl border border-slate-200 p-8 shadow-xl">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-3 mb-8 group">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-slate-500 to-slate-700 rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/25 group-hover:scale-105 transition-transform">
                <Car className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-slate-500 rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gradient tracking-tight">
                VALERON
              </span>
              <span className="text-[10px] font-medium text-slate-500 tracking-[0.2em] uppercase">
                Automart
              </span>
            </div>
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h1>
            <p className="text-slate-500">Open the personal link we sent you to see your auction list</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error === 'LinkExpired'
                ? 'Your link has expired or was replaced with a newer one. Ask us for a fresh link.'
                : error === 'CredentialsSignin'
                  ? 'That link isn’t valid any more. Ask us for a fresh link.'
                  : 'Something went wrong signing you in. Please open your link again.'}
            </div>
          )}

          {/* Paste a link */}
          <form onSubmit={openPasted} className="space-y-3">
            <label htmlFor="link" className="block text-sm font-medium text-slate-700">Got your link on another device?</label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="link"
                value={pasted}
                onChange={(e) => { setPasted(e.target.value); setPasteError('') }}
                placeholder="Paste your link here"
                autoComplete="off"
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none text-slate-800"
              />
            </div>
            {pasteError && <p className="text-sm text-red-600">{pasteError}</p>}
            <button type="submit" className="btn-primary w-full">Open my link</button>
          </form>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl py-3 px-6 border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            No link? Ask us on WhatsApp
          </a>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">or browse as guest</span>
            </div>
          </div>

          {/* Guest Access Info */}
          <div className="bg-slate-50 backdrop-blur-xl rounded-xl p-5 border border-slate-200">
            <p className="text-sm text-slate-500 mb-4 text-center">
              You can browse vehicles without signing in.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/stocks" className="px-4 py-2 rounded-lg bg-slate-100 border border-slate-300 text-slate-800 text-sm font-medium hover:bg-slate-200 transition-colors">
                View Stock
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto bg-slate-100 rounded-lg flex items-center justify-center mb-2 border border-slate-300">
                <Shield className="w-5 h-5 text-slate-800" />
              </div>
              <p className="text-xs text-slate-500">Secure</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto bg-slate-100 rounded-lg flex items-center justify-center mb-2 border border-slate-300">
                <Zap className="w-5 h-5 text-slate-800" />
              </div>
              <p className="text-xs text-slate-500">Fast</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto bg-slate-100 rounded-lg flex items-center justify-center mb-2 border border-slate-300">
                <Sparkles className="w-5 h-5 text-slate-800" />
              </div>
              <p className="text-xs text-slate-500">Premium</p>
            </div>
          </div>

          {/* Terms */}
          <p className="text-xs text-slate-500 text-center mt-6">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-slate-800 hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-slate-800 hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function SignInLoading() {
  return (
    <Loader label="Preparing sign in" />
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInLoading />}>
      <SignInContent />
    </Suspense>
  )
}
