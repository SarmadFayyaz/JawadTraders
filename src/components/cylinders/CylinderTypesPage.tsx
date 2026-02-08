'use client'

import { useState, useActionState } from 'react'
import { useLanguage } from '@/lib/language-context'
import { formatCurrency } from '@/lib/utils'
import { addCylinderType, updateCylinderType, deleteCylinderType } from '@/app/settings/cylinder-types/actions'
import type { CylinderType } from '@/types/database'

export function CylinderTypesPage({
  cylinderTypes,
}: {
  cylinderTypes: CylinderType[]
}) {
  const { labels, dateLocale } = useLanguage()
  const [state, formAction] = useActionState(addCylinderType, { error: null as string | null })

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold sm:text-2xl">{labels.cylinderTypes}</h1>

      {/* Add Cylinder Type Form */}
      <form action={formAction} className="card space-y-4 p-4 sm:p-6">
        <h2 className="text-base font-semibold text-primary-700 sm:text-lg">{labels.addCylinderType}</h2>
        {state?.error === 'duplicate' && (
          <p className="text-sm text-red-600">{labels.duplicateName}</p>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
        </div>
        <button
          type="submit"
          className="rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          {labels.addCylinderType}
        </button>
      </form>

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
  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [editState, editAction] = useActionState(updateCylinderType, { error: null as string | null })

  if (editing) {
    return (
      <tr className="border-b border-gray-100">
        <td className="py-3 pe-4" colSpan={6}>
          <form action={editAction} className="space-y-2">
            <div className="flex flex-wrap items-end gap-3">
              <input type="hidden" name="id" value={cylinderType.id} />
              <div>
                <label className="mb-1 block text-xs font-medium">{labels.cylinderName}</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={cylinderType.name}
                  className="w-36 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">{labels.cylinderWeightKg}</label>
                <input
                  type="number"
                  name="weight_kg"
                  required
                  min="0.01"
                  step="0.01"
                  dir="ltr"
                  defaultValue={cylinderType.weight_kg}
                  className="w-24 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">{labels.cylinderPrice}</label>
                <input
                  type="number"
                  name="cylinder_price"
                  required
                  min="0"
                  step="1"
                  dir="ltr"
                  defaultValue={cylinderType.cylinder_price}
                  className="w-28 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">{labels.gasPrice}</label>
                <input
                  type="number"
                  name="gas_price"
                  required
                  min="0"
                  step="1"
                  dir="ltr"
                  defaultValue={cylinderType.gas_price}
                  className="w-28 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">{labels.noOfCylinders}</label>
                <input
                  type="number"
                  name="no_of_cylinders"
                  required
                  min="0"
                  step="1"
                  dir="ltr"
                  defaultValue={cylinderType.no_of_cylinders}
                  className="w-24 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-lg bg-primary-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-primary-700"
                >
                  {labels.save}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-lg border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  {labels.cancel}
                </button>
              </div>
            </div>
            {editState?.error === 'duplicate' && (
              <p className="text-sm text-red-600">{labels.duplicateName}</p>
            )}
          </form>
        </td>
      </tr>
    )
  }

  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 pe-4 font-medium">{cylinderType.name}</td>
      <td className="py-3 pe-4" dir="ltr">{cylinderType.weight_kg} kg</td>
      <td className="py-3 pe-4" dir="ltr">{formatCurrency(cylinderType.cylinder_price, dateLocale)}</td>
      <td className="py-3 pe-4" dir="ltr">{formatCurrency(cylinderType.gas_price, dateLocale)}</td>
      <td className="py-3 pe-4" dir="ltr">{cylinderType.no_of_cylinders}</td>
      <td className="py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditing(true)}
            className="text-primary-600 hover:underline"
          >
            {labels.editCylinderType}
          </button>
          {!confirming ? (
            <button
              onClick={() => setConfirming(true)}
              className="text-red-600 hover:underline"
            >
              {labels.deleteClient}
            </button>
          ) : (
            <form action={deleteCylinderType} className="inline-flex items-center gap-2">
              <input type="hidden" name="id" value={cylinderType.id} />
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
