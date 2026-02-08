'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import { login } from '@/app/auth/actions'

export function LoginForm({ error, success }: { error?: string; success?: string }) {
  const { businessName, labels, locale, toggleLanguage } = useLanguage()

  const errorMessage = error === 'unconfirmed' ? labels.emailNotConfirmed : labels.loginError

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="card w-full max-w-sm space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary-700">{businessName}</h1>
          <button
            onClick={toggleLanguage}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            {locale === 'ur' ? 'English' : 'اردو'}
          </button>
        </div>

        <h2 className="text-center text-lg font-semibold">{labels.login}</h2>

        {success && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
            {labels.signupSuccess}
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        <form action={login} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.email}</label>
            <input
              type="email"
              name="email"
              required
              dir="ltr"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.password}</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              dir="ltr"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            {labels.loginButton}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          {labels.noAccount}{' '}
          <Link href="/signup" className="font-medium text-primary-600 hover:text-primary-700">
            {labels.signup}
          </Link>
        </p>
      </div>
    </div>
  )
}
