'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/language-context'
import { formatDate } from '@/lib/utils'
import { addItem, deleteItem } from '@/app/settings/clients/[id]/items/actions'
import type { Client, ClientItem } from '@/types/database'

export function ClientItemsPage({ client, items }: { client: Client; items: ClientItem[] }) {
  const { labels, dateLocale } = useLanguage()

  return (
    <div className="space-y-6">
      <form action={addItem} className="card space-y-4 p-4 sm:p-6">
        <h2 className="text-base font-semibold sm:text-lg">{labels.addItem}</h2>
        <input type="hidden" name="client_id" value={client.id} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.itemName}</label>
            <input
              type="text"
              name="item_name"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.quantity}</label>
            <input
              type="number"
              name="quantity"
              required
              min="0.01"
              step="0.01"
              dir="ltr"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.date}</label>
            <input
              type="date"
              name="date"
              required
              defaultValue={new Date().toISOString().split('T')[0]}
              dir="ltr"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          {labels.save}
        </button>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="pb-2 pe-4 text-start font-medium">{labels.itemName}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.quantity}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.date}</th>
              <th className="pb-2 text-start font-medium">{labels.actions}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <ItemRow key={item.id} item={item} clientId={client.id} labels={labels} dateLocale={dateLocale} />
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <p className="py-8 text-center text-gray-500">{labels.noData}</p>
        )}
      </div>
    </div>
  )
}

function ItemRow({
  item,
  clientId,
  labels,
  dateLocale,
}: {
  item: ClientItem
  clientId: string
  labels: Record<string, string>
  dateLocale: string
}) {
  const [confirming, setConfirming] = useState(false)

  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 pe-4 font-medium">{item.item_name}</td>
      <td className="py-3 pe-4" dir="ltr">{item.quantity}</td>
      <td className="py-3 pe-4">{formatDate(item.date, dateLocale)}</td>
      <td className="py-3">
        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="text-red-600 hover:underline"
          >
            {labels.deleteClient}
          </button>
        ) : (
          <form action={deleteItem} className="inline-flex gap-2">
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="client_id" value={clientId} />
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
      </td>
    </tr>
  )
}
