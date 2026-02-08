'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import { addClient, updateClient } from '@/app/settings/clients/actions'
import type { Client } from '@/types/database'

export function ClientForm({ client }: { client?: Client }) {
  const { labels } = useLanguage()
  const isEditing = !!client
  const [state, formAction] = useActionState(
    isEditing ? updateClient : addClient,
    { error: null as string | null }
  )

  return (
    <form action={formAction} className="card max-w-md space-y-4 p-4 sm:p-6">
      {isEditing && <input type="hidden" name="id" value={client.id} />}

      <div>
        <label className="mb-1 block text-sm font-medium">{labels.clientName}</label>
        <input
          type="text"
          name="name"
          required
          defaultValue={client?.name ?? ''}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        {state?.error === 'duplicate' && (
          <p className="mt-1 text-sm text-red-600">{labels.duplicateName}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">{labels.clientPhone}</label>
        <input
          type="text"
          name="phone"
          dir="ltr"
          defaultValue={client?.phone ?? ''}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          {labels.save}
        </button>
        <Link
          href="/settings/clients"
          className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          {labels.cancel}
        </Link>
      </div>
    </form>
  )
}
