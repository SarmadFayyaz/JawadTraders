'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/language-context'
import { useToast } from '@/lib/toast-context'
import { formatCurrency } from '@/lib/utils'
import { addCylinderType, updateCylinderType, deleteCylinderType } from '@/app/settings/cylinder-types/actions'
import { Modal } from '@/components/ui/Modal'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import type { CylinderType } from '@/types/database'

export function CylinderTypesPage({
  cylinderTypes,
}: {
  cylinderTypes: CylinderType[]
}) {
  const { labels, dateLocale } = useLanguage()
  const { showSuccess, showError } = useToast()
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [addDuplicateError, setAddDuplicateError] = useState(false)

  async function handleAddSubmit(formData: FormData) {
    setAddDuplicateError(false)
    const result = await addCylinderType(formData)
    if (result?.success) {
      showSuccess(labels.successSaved)
      setAddModalOpen(false)
    } else if (result?.error === 'duplicate') {
      setAddDuplicateError(true)
    } else {
      showError(result?.error || labels.errorOccurred)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold sm:text-2xl">{labels.cylinderTypes}</h1>
        <button
          onClick={() => { setAddDuplicateError(false); setAddModalOpen(true) }}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          {labels.addCylinderType}
        </button>
      </div>

      {/* Add Cylinder Type Modal */}
      <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)} title={labels.addCylinderType}>
        <form action={handleAddSubmit} className="space-y-4">
          {addDuplicateError && (
            <p className="text-sm text-red-600">{labels.duplicateName}</p>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.cylinderName}</label>
            <input
              type="text"
              name="name"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder={labels.cylinderName}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.cylinderWeightKg}</label>
            <input
              type="number"
              name="weight_kg"
              required
              min="0.01"
              step="0.01"
              dir="ltr"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.cylinderPrice}</label>
            <input
              type="number"
              name="cylinder_price"
              required
              min="0"
              step="1"
              dir="ltr"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.gasPrice}</label>
            <input
              type="number"
              name="gas_price"
              required
              min="0"
              step="1"
              dir="ltr"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.noOfCylinders}</label>
            <input
              type="number"
              name="no_of_cylinders"
              required
              min="0"
              step="1"
              dir="ltr"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            {labels.addCylinderType}
          </button>
        </form>
      </Modal>

      {/* Cylinder Types List */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="pb-2 pe-4 text-start font-medium">{labels.cylinderName}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.cylinderWeightKg}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.cylinderPrice}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.gasPrice}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.noOfCylinders}</th>
              <th className="pb-2 text-start font-medium">{labels.actions}</th>
            </tr>
          </thead>
          <tbody>
            {cylinderTypes.map((ct) => (
              <CylinderTypeRow key={ct.id} cylinderType={ct} labels={labels} dateLocale={dateLocale} />
            ))}
          </tbody>
        </table>

        {cylinderTypes.length === 0 && (
          <p className="py-8 text-center text-gray-500">{labels.noCylinderTypes}</p>
        )}
      </div>
    </div>
  )
}

function CylinderTypeRow({
  cylinderType,
  labels,
  dateLocale,
}: {
  cylinderType: CylinderType
  labels: Record<string, string>
  dateLocale: string
}) {
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editDuplicateError, setEditDuplicateError] = useState(false)
  const { showSuccess, showError } = useToast()

  async function handleEditSubmit(formData: FormData) {
    setEditDuplicateError(false)
    const result = await updateCylinderType(formData)
    if (result?.success) {
      showSuccess(labels.successSaved)
      setEditModalOpen(false)
    } else if (result?.error === 'duplicate') {
      setEditDuplicateError(true)
    } else {
      showError(result?.error || labels.errorOccurred)
    }
  }

  return (
    <>
      <tr className="border-b border-gray-100">
        <td className="py-3 pe-4 font-medium">{cylinderType.name}</td>
        <td className="py-3 pe-4" dir="ltr">{cylinderType.weight_kg} kg</td>
        <td className="py-3 pe-4" dir="ltr">{formatCurrency(cylinderType.cylinder_price, dateLocale)}</td>
        <td className="py-3 pe-4" dir="ltr">{formatCurrency(cylinderType.gas_price, dateLocale)}</td>
        <td className="py-3 pe-4" dir="ltr">{cylinderType.no_of_cylinders}</td>
        <td className="py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setEditDuplicateError(false); setEditModalOpen(true) }}
              className="text-primary-600 hover:underline"
            >
              {labels.editCylinderType}
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              className="text-red-600 hover:underline"
            >
              {labels.deleteClient}
            </button>
          </div>
        </td>
      </tr>

      {/* Edit Cylinder Type Modal */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} title={labels.editCylinderType}>
        <form action={handleEditSubmit} className="space-y-4">
          <input type="hidden" name="id" value={cylinderType.id} />
          {editDuplicateError && (
            <p className="text-sm text-red-600">{labels.duplicateName}</p>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.cylinderName}</label>
            <input
              type="text"
              name="name"
              required
              defaultValue={cylinderType.name}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.cylinderWeightKg}</label>
            <input
              type="number"
              name="weight_kg"
              required
              min="0.01"
              step="0.01"
              dir="ltr"
              defaultValue={cylinderType.weight_kg}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.cylinderPrice}</label>
            <input
              type="number"
              name="cylinder_price"
              required
              min="0"
              step="1"
              dir="ltr"
              defaultValue={cylinderType.cylinder_price}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.gasPrice}</label>
            <input
              type="number"
              name="gas_price"
              required
              min="0"
              step="1"
              dir="ltr"
              defaultValue={cylinderType.gas_price}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.noOfCylinders}</label>
            <input
              type="number"
              name="no_of_cylinders"
              required
              min="0"
              step="1"
              dir="ltr"
              defaultValue={cylinderType.no_of_cylinders}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
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
              onClick={() => setEditModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              {labels.cancel}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          const formData = new FormData()
          formData.append('id', cylinderType.id)
          const result = await deleteCylinderType(formData)
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
    </>
  )
}
