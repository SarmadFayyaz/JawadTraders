'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'

export function AddClientButton() {
  const { labels } = useLanguage()

  return (
    <Link
      href="/settings/clients/new"
      className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
    >
      + {labels.addClient}
    </Link>
  )
}
