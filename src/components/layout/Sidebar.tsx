'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_KEYS, SETTINGS_SUB_KEYS } from '@/lib/constants'
import { useLanguage } from '@/lib/language-context'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const pathname = usePathname()
  const { businessName, labels } = useLanguage()
  const [open, setOpen] = useState(false)

  const isSettingsActive = SETTINGS_SUB_KEYS.some(
    (item) => pathname === item.href || pathname.startsWith(item.href + '/')
  )
  const [settingsOpen, setSettingsOpen] = useState(isSettingsActive)

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed start-4 top-4 z-40 rounded-lg bg-white p-2 shadow-md lg:hidden"
        aria-label="Open menu"
      >
        <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 start-0 z-50 flex w-64 flex-col border-e border-gray-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : 'max-lg:-translate-x-full max-lg:rtl:translate-x-full'
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4">
          <h1 className="text-lg font-bold text-primary-700">{businessName}</h1>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 lg:hidden"
            aria-label="Close menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV_KEYS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-primary-50 font-semibold text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <span>{item.icon}</span>
                <span>{labels[item.labelKey]}</span>
              </Link>
            )
          })}

          {/* Settings with sub-menu */}
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              isSettingsActive
                ? 'bg-primary-50 font-semibold text-primary-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            <span>⚙️</span>
            <span className="flex-1 text-start">{labels.settings}</span>
            <svg
              className={cn('h-4 w-4 transition-transform', settingsOpen && 'rotate-90')}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {settingsOpen && (
            <div className="ms-4 space-y-1 border-s border-gray-200 ps-2">
              {SETTINGS_SUB_KEYS.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-primary-50 font-semibold text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <span>{item.icon}</span>
                    <span>{labels[item.labelKey]}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </nav>
      </aside>
    </>
  )
}
