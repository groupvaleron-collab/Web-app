import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl sm:text-9xl font-bold text-gray-200">404</h1>
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-4">Page Not Found</h2>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Sorry, the page you are looking for doesn't exist or you don't have permission to access it.
        </p>
        <Link
          href="/"
          className="inline-block mt-8 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
