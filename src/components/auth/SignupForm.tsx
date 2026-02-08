'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import { signup } from '@/app/auth/actions'

export function SignupForm({ error }: { error?: string }) {
  const { businessName, labels, locale, toggleLanguage } = useLanguage()
  const [mismatch, setMismatch] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      setMismatch(true)
      return
    }

    setMismatch(false)
    formData.delete('confirmPassword')
    signup(formData)
  }

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

        <h2 className="text-center text-lg font-semibold">{labels.signup}</h2>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {labels.signupError}
          </div>
        )}
        {mismatch && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {labels.passwordMismatch}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.confirmPassword}</label>
            <input
              type="password"
              name="confirmPassword"
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
            {labels.signupButton}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          {labels.haveAccount}{' '}
          <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700">
            {labels.login}
          </Link>
        </p>
      </div>
    </div>
  )
}
