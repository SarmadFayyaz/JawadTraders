'use client'

import { useState, useActionState } from 'react'
import { useLanguage } from '@/lib/language-context'
import { VEGETABLE_UNITS } from '@/lib/constants'
import { addVegetableName, updateVegetableName, deleteVegetableName } from '@/app/settings/vegetables/actions'
import type { VegetableName } from '@/types/database'

export function VegetableNamesPage({
  vegetableNames,
}: {
  vegetableNames: VegetableName[]
}) {
  const { labels } = useLanguage()
  const [state, formAction] = useActionState(addVegetableName, { error: null as string | null })

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold sm:text-2xl">{labels.manageVegetables}</h1>

      {/* Add Vegetable Name Form */}
      <form action={formAction} className="card space-y-4 p-4 sm:p-6">
        <h2 className="text-base font-semibold text-primary-700 sm:text-lg">{labels.addVegetableName}</h2>
        {state?.error === 'duplicate' && (
          <p className="text-sm text-red-600">{labels.duplicateName}</p>
        )}
        <div className="flex flex-wrap items-end gap-3 sm:gap-4">
          <div className="w-full sm:w-auto sm:flex-1">
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
            <select
              name="unit"
              required
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              {VEGETABLE_UNITS.map((u) => (
                <option key={u.value} value={u.value}>{labels[u.labelKey]}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 sm:w-auto"
          >
            {labels.addVegetableName}
          </button>
        </div>
      </form>

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
  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [editState, editAction] = useActionState(updateVegetableName, { error: null as string | null })

  const unitLabel = VEGETABLE_UNITS.find((u) => u.value === vegetableName.unit)
  const unitDisplay = unitLabel ? labels[unitLabel.labelKey] : vegetableName.unit

  if (editing) {
    return (
      <tr className="border-b border-gray-100">
        <td className="py-3 pe-4" colSpan={3}>
          <form action={editAction} className="space-y-2">
            <div className="flex flex-wrap items-end gap-3">
              <input type="hidden" name="id" value={vegetableName.id} />
              <div className="w-full sm:w-auto sm:flex-1">
                <label className="mb-1 block text-xs font-medium">{labels.vegetableName}</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={vegetableName.name}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">{labels.unit}</label>
                <select
                  name="unit"
                  required
                  defaultValue={vegetableName.unit}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {VEGETABLE_UNITS.map((u) => (
                    <option key={u.value} value={u.value}>{labels[u.labelKey]}</option>
                  ))}
                </select>
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
      <td className="py-3 pe-4 font-medium">{vegetableName.name}</td>
      <td className="py-3 pe-4 text-gray-600">{unitDisplay}</td>
      <td className="py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditing(true)}
            className="text-primary-600 hover:underline"
          >
            {labels.editVegetableName}
          </button>
          {!confirming ? (
            <button
              onClick={() => setConfirming(true)}
              className="text-red-600 hover:underline"
            >
              {labels.deleteClient}
            </button>
          ) : (
            <form action={deleteVegetableName} className="inline-flex items-center gap-2">
              <input type="hidden" name="id" value={vegetableName.id} />
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
