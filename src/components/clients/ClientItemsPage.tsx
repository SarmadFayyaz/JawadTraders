'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/language-context'
import { useToast } from '@/lib/toast-context'
import { Modal } from '@/components/ui/Modal'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { DatePicker } from '@/components/ui/DatePicker'
import { formatDate } from '@/lib/utils'
import { addItem, deleteItem } from '@/app/settings/clients/[id]/items/actions'
import type { Client, ClientItem } from '@/types/database'

export function ClientItemsPage({ client, items }: { client: Client; items: ClientItem[] }) {
  const { labels, dateLocale } = useLanguage()
  const { showSuccess, showError } = useToast()
  const [addOpen, setAddOpen] = useState(false)
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold sm:text-2xl">{labels.items}</h1>
        <button
          onClick={() => {
            setDate(new Date().toISOString().split('T')[0])
            setAddOpen(true)
          }}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          {labels.addItem}
        </button>
      </div>

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
              <ItemRow
                key={item.id}
                item={item}
                clientId={client.id}
                labels={labels}
                dateLocale={dateLocale}
                showSuccess={showSuccess}
                showError={showError}
              />
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <p className="py-8 text-center text-gray-500">{labels.noData}</p>
        )}
      </div>

      {/* Add Item Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={labels.addItem}>
        <form
          action={async (formData) => {
            const result = await addItem(formData)
            if (result?.success) {
              showSuccess(labels.successSaved)
              setAddOpen(false)
            } else if (result?.error) {
              showError(labels.errorOccurred)
            }
          }}
          className="space-y-4"
        >
          <input type="hidden" name="client_id" value={client.id} />
          <input type="hidden" name="date" value={date} />
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
            <DatePicker value={date} onChange={setDate} />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            {labels.save}
          </button>
        </form>
      </Modal>
    </div>
  )
}

function ItemRow({
  item,
  clientId,
  labels,
  dateLocale,
  showSuccess,
  showError,
}: {
  item: ClientItem
  clientId: string
  labels: Record<string, string>
  dateLocale: string
  showSuccess: (msg: string) => void
  showError: (msg: string) => void
}) {
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 pe-4 font-medium">{item.item_name}</td>
      <td className="py-3 pe-4" dir="ltr">{item.quantity}</td>
      <td className="py-3 pe-4">{formatDate(item.date, dateLocale)}</td>
      <td className="py-3">
        <button
          onClick={() => setDeleteOpen(true)}
          className="text-red-600 hover:underline"
        >
          {labels.deleteClient}
        </button>
        <ConfirmModal
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={async () => {
            const formData = new FormData()
            formData.append('id', item.id)
            formData.append('client_id', clientId)
            const result = await deleteItem(formData)
            if (result?.success) {
              showSuccess(labels.successDeleted)
              setDeleteOpen(false)
            } else if (result?.error) {
              showError(labels.errorOccurred)
            }
          }}
          title={labels.deleteClient}
          message={labels.deleteConfirm}
          confirmLabel={labels.deleteClient}
          cancelLabel={labels.cancel}
        />
      </td>
    </tr>
  )
}
