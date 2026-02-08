'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/language-context'
import { deleteClient } from '@/app/settings/clients/actions'
import type { Client } from '@/types/database'

export function ClientList({ clients }: { clients: Client[] }) {
  const { labels } = useLanguage()
  const [search, setSearch] = useState('')

  const filtered = clients.filter(
    (c) => c.name.includes(search) || (c.phone ?? '').includes(search)
  )

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={labels.search}
          className="w-full max-w-sm rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="pb-2 pe-4 text-start font-medium">{labels.clientName}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.clientPhone}</th>
              <th className="pb-2 text-start font-medium">{labels.actions}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((client) => (
              <ClientRow key={client.id} client={client} labels={labels} />
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="py-8 text-center text-gray-500">{labels.noData}</p>
        )}
      </div>
    </div>
  )
}

function ClientRow({ client, labels }: { client: Client; labels: Record<string, string> }) {
  const [confirming, setConfirming] = useState(false)

  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 pe-4 font-medium">{client.name}</td>
      <td className="py-3 pe-4" dir="ltr">
        {client.phone ?? '—'}
      </td>
      <td className="py-3">
        <div className="flex gap-2">
          <a
            href={`/settings/clients/${client.id}/items`}
            className="text-primary-600 hover:underline"
          >
            {labels.viewItems}
          </a>
          <a
            href={`/settings/clients/${client.id}/edit`}
            className="text-primary-600 hover:underline"
          >
            {labels.editClient}
          </a>
          {!confirming ? (
            <button
              onClick={() => setConfirming(true)}
              className="text-red-600 hover:underline"
            >
              {labels.deleteClient}
            </button>
          ) : (
            <form action={deleteClient} className="inline-flex gap-2">
              <input type="hidden" name="id" value={client.id} />
              <span className="text-sm text-red-600">{labels.deleteConfirm}</span>
              <button type="submit" className="font-medium text-red-700 hover:underline">
                ✓
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="font-medium text-gray-500 hover:underline"
              >
                ✕
              </button>
            </form>
          )}
        </div>
      </td>
    </tr>
  )
}
