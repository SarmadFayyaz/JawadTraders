'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/language-context'
import { useToast } from '@/lib/toast-context'
import { VEGETABLE_UNITS } from '@/lib/constants'
import { addVegetableName, updateVegetableName, deleteVegetableName } from '@/app/settings/vegetables/actions'
import { Modal } from '@/components/ui/Modal'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import type { VegetableName } from '@/types/database'

export function VegetableNamesPage({
  vegetableNames,
}: {
  vegetableNames: VegetableName[]
}) {
  const { labels } = useLanguage()
  const { showSuccess, showError } = useToast()
  const [showAddModal, setShowAddModal] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold sm:text-2xl">{labels.manageVegetables}</h1>
        <button
          onClick={() => { setShowAddModal(true); setAddError(null) }}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          {labels.addVegetableName}
        </button>
      </div>

      {/* Add Vegetable Name Modal */}
      <Modal
        open={showAddModal}
        onClose={() => { setShowAddModal(false); setAddError(null) }}
        title={labels.addVegetableName}
      >
        <form
          action={async (formData) => {
            const result = await addVegetableName(null, formData)
            if (result?.success) {
              showSuccess(labels.successSaved)
              setShowAddModal(false)
              setAddError(null)
            } else if (result?.error === 'duplicate') {
              setAddError(labels.duplicateName)
            } else {
              showError(result?.error || labels.errorOccurred)
            }
          }}
          className="space-y-4"
        >
          {addError && (
            <p className="text-sm text-red-600">{addError}</p>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.vegetableName}</label>
            <input
              type="text"
              name="name"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder={labels.vegetableName}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.unit}</label>
            <SearchableSelect
              name="unit"
              required
              defaultValue="kg"
              placeholder={labels.unit}
              options={VEGETABLE_UNITS.map((u) => ({ value: u.value, label: labels[u.labelKey] }))}
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              {labels.save}
            </button>
            <button
              type="button"
              onClick={() => { setShowAddModal(false); setAddError(null) }}
              className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              {labels.cancel}
            </button>
          </div>
        </form>
      </Modal>

      {/* Vegetable Names List */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="pb-2 pe-4 text-start font-medium">{labels.vegetableName}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.unit}</th>
              <th className="pb-2 text-start font-medium">{labels.actions}</th>
            </tr>
          </thead>
          <tbody>
            {vegetableNames.map((vn) => (
              <VegetableNameRow key={vn.id} vegetableName={vn} labels={labels} />
            ))}
          </tbody>
        </table>

        {vegetableNames.length === 0 && (
          <p className="py-8 text-center text-gray-500">{labels.noVegetableNames}</p>
        )}
      </div>
    </div>
  )
}

function VegetableNameRow({
  vegetableName,
  labels,
}: {
  vegetableName: VegetableName
  labels: Record<string, string>
}) {
  const { showSuccess, showError } = useToast()
  const [showEditModal, setShowEditModal] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  const unitLabel = VEGETABLE_UNITS.find((u) => u.value === vegetableName.unit)
  const unitDisplay = unitLabel ? labels[unitLabel.labelKey] : vegetableName.unit

  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 pe-4 font-medium">{vegetableName.name}</td>
      <td className="py-3 pe-4 text-gray-600">{unitDisplay}</td>
      <td className="py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setShowEditModal(true); setEditError(null) }}
            className="text-primary-600 hover:underline"
          >
            {labels.editVegetableName}
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
              formData.append('id', vegetableName.id)
              const result = await deleteVegetableName(formData)
              if (result?.success) {
                showSuccess(labels.successDeleted)
                setDeleteOpen(false)
              } else {
                showError(result?.error || labels.errorOccurred)
              }
            }}
            title={labels.deleteClient}
            message={labels.deleteConfirm}
            confirmLabel={labels.deleteClient}
            cancelLabel={labels.cancel}
          />
        </div>

        {/* Edit Modal */}
        <Modal
          open={showEditModal}
          onClose={() => { setShowEditModal(false); setEditError(null) }}
          title={labels.editVegetableName}
        >
          <form
            action={async (formData) => {
              const result = await updateVegetableName(null, formData)
              if (result?.success) {
                showSuccess(labels.successSaved)
                setShowEditModal(false)
                setEditError(null)
              } else if (result?.error === 'duplicate') {
                setEditError(labels.duplicateName)
              } else {
                showError(result?.error || labels.errorOccurred)
              }
            }}
            className="space-y-4"
          >
            <input type="hidden" name="id" value={vegetableName.id} />
            {editError && (
              <p className="text-sm text-red-600">{editError}</p>
            )}
            <div>
              <label className="mb-1 block text-sm font-medium">{labels.vegetableName}</label>
              <input
                type="text"
                name="name"
                required
                defaultValue={vegetableName.name}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">{labels.unit}</label>
              <SearchableSelect
                name="unit"
                required
                defaultValue={vegetableName.unit}
                placeholder={labels.unit}
                options={VEGETABLE_UNITS.map((u) => ({ value: u.value, label: labels[u.labelKey] }))}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                {labels.save}
              </button>
              <button
                type="button"
                onClick={() => { setShowEditModal(false); setEditError(null) }}
                className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
              >
                {labels.cancel}
              </button>
            </div>
          </form>
        </Modal>
      </td>
    </tr>
  )
}
