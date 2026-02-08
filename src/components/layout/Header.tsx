'use client'

import { useLanguage } from '@/lib/language-context'
import { logout } from '@/app/auth/actions'

export function Header() {
  const { labels, locale, dateLocale, toggleLanguage } = useLanguage()

  return (
    <header className="flex min-h-14 flex-wrap items-center justify-between gap-2 border-b border-gray-200 bg-white px-4 py-2 ps-14 lg:px-6 lg:ps-6">
      <span className="text-sm text-gray-500">
        {new Date().toLocaleDateString(dateLocale)}
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleLanguage}
          className="rounded-lg border border-gray-300 px-2.5 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          {locale === 'ur' ? 'EN' : 'اردو'}
        </button>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
          >
            {labels.logout}
          </button>
        </form>
      </div>
    </header>
  )
}
