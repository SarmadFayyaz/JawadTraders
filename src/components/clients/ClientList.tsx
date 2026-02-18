'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/language-context'
import { useToast } from '@/lib/toast-context'
import { Modal } from '@/components/ui/Modal'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { addClient, updateClient, deleteClient } from '@/app/settings/clients/actions'
import type { Client } from '@/types/database'

export function ClientList({ clients }: { clients: Client[] }) {
  const { labels } = useLanguage()
  const { showSuccess, showError } = useToast()
  const [search, setSearch] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [editClient, setEditClient] = useState<Client | null>(null)
  const [addError, setAddError] = useState<string | null>(null)
  const [editError, setEditError] = useState<string | null>(null)

  const filtered = clients.filter(
    (c) => c.name.includes(search) || (c.phone ?? '').includes(search)
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold sm:text-2xl">{labels.clients}</h1>
        <button
          onClick={() => { setAddError(null); setAddOpen(true) }}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          {labels.addClient}
        </button>
      </div>

      <div className="flex items-center">
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
              <ClientRow
                key={client.id}
                client={client}
                labels={labels}
                onEdit={(c) => { setEditError(null); setEditClient(c) }}
                showSuccess={showSuccess}
                showError={showError}
              />
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="py-8 text-center text-gray-500">{labels.noData}</p>
        )}
      </div>

      {/* Add Client Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={labels.addClient}>
        <form
          action={async (formData) => {
            const result = await addClient(null, formData)
            if (result?.success) {
              showSuccess(labels.successSaved)
              setAddOpen(false)
              setAddError(null)
            } else if (result?.error) {
              if (result.error === 'duplicate') {
                setAddError(labels.duplicateName)
              } else {
                showError(labels.errorOccurred)
              }
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.clientName}</label>
            <input
              type="text"
              name="name"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.clientPhone}</label>
            <input
              type="text"
              name="phone"
              dir="ltr"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          {addError && (
            <p className="text-sm text-red-600">{addError}</p>
          )}
          <button
            type="submit"
            className="rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            {labels.save}
          </button>
        </form>
      </Modal>

      {/* Edit Client Modal */}
      <Modal
        open={editClient !== null}
        onClose={() => setEditClient(null)}
        title={labels.editClient}
      >
        {editClient && (
          <form
            action={async (formData) => {
              const result = await updateClient(null, formData)
              if (result?.success) {
                showSuccess(labels.successSaved)
                setEditClient(null)
                setEditError(null)
              } else if (result?.error) {
                if (result.error === 'duplicate') {
                  setEditError(labels.duplicateName)
                } else {
                  showError(labels.errorOccurred)
                }
              }
            }}
            className="space-y-4"
          >
            <input type="hidden" name="id" value={editClient.id} />
            <div>
              <label className="mb-1 block text-sm font-medium">{labels.clientName}</label>
              <input
                type="text"
                name="name"
                required
                defaultValue={editClient.name}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">{labels.clientPhone}</label>
              <input
                type="text"
                name="phone"
                dir="ltr"
                defaultValue={editClient.phone ?? ''}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            {editError && (
              <p className="text-sm text-red-600">{editError}</p>
            )}
            <button
              type="submit"
              className="rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              {labels.save}
            </button>
          </form>
        )}
      </Modal>
    </div>
  )
}

function ClientRow({
  client,
  labels,
  onEdit,
  showSuccess,
  showError,
}: {
  client: Client
  labels: Record<string, string>
  onEdit: (client: Client) => void
  showSuccess: (msg: string) => void
  showError: (msg: string) => void
}) {
  const [deleteOpen, setDeleteOpen] = useState(false)

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
          <button
            onClick={() => onEdit(client)}
            className="text-primary-600 hover:underline"
          >
            {labels.editClient}
          </button>
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
              formData.append('id', client.id)
              const result = await deleteClient(formData)
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
        </div>
      </td>
    </tr>
  )
}
