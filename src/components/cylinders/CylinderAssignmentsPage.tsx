'use client'

import { useState, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/language-context'
import { assignCylinder, updateAssignment, deleteAssignment } from '@/app/cylinders/actions'
import type { Client, CylinderType } from '@/types/database'

interface AssignmentWithJoins {
  id: string
  client_id: string
  cylinder_type_id: string
  quantity: number
  date: string
  clients: { name: string }
  cylinder_types: { name: string }
}

export function CylinderAssignmentsPage({
  clients,
  cylinderTypes,
  assignments,
  selectedDate,
}: {
  clients: Pick<Client, 'id' | 'name'>[]
  cylinderTypes: CylinderType[]
  assignments: AssignmentWithJoins[]
  selectedDate: string
}) {
  const { labels } = useLanguage()
  const router = useRouter()
  const [state, formAction] = useActionState(assignCylinder, { error: null as string | null })

  // Calculate totals per cylinder type
  const assignedByType = new Map<string, number>()
  for (const a of assignments) {
    assignedByType.set(a.cylinder_type_id, (assignedByType.get(a.cylinder_type_id) || 0) + a.quantity)
  }
  const totalAssigned = assignments.reduce((sum, a) => sum + a.quantity, 0)
  const totalInventory = cylinderTypes.reduce((sum, ct) => sum + ct.no_of_cylinders, 0) + totalAssigned

  // Group assignments by client
  const byClient = new Map<string, { name: string; items: AssignmentWithJoins[] }>()
  for (const a of assignments) {
    const existing = byClient.get(a.client_id)
    if (existing) {
      existing.items.push(a)
    } else {
      byClient.set(a.client_id, { name: a.clients.name, items: [a] })
    }
  }
  const grouped = Array.from(byClient.values())

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold sm:text-2xl">{labels.cylinderAssignments}</h1>

      {/* Date Picker */}
      <div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => router.push(`/cylinders?date=${e.target.value}`)}
          dir="ltr"
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      {/* Summary Card */}
      <div className="card flex flex-wrap items-center gap-4 p-4 sm:gap-6 sm:p-5">
        <div className="text-center">
          <p className="text-xl font-bold text-primary-700 sm:text-2xl" dir="ltr">{totalAssigned} / {totalInventory}</p>
          <p className="text-xs text-gray-500">{labels.total} {labels.assigned}</p>
        </div>
        <div className="h-10 w-px bg-gray-200" />
        {cylinderTypes.map((ct) => {
          const assigned = assignedByType.get(ct.id) || 0
          const total = ct.no_of_cylinders + assigned
          return (
            <div key={ct.id} className="text-center">
              <p className="text-lg font-semibold" dir="ltr">{assigned} / {total}</p>
              <p className="text-xs text-gray-500">{ct.name}</p>
            </div>
          )
        })}
      </div>

      {/* Assign Cylinder Form */}
      <form action={formAction} className="card space-y-4 p-4 sm:p-6">
        <h2 className="text-base font-semibold text-primary-700 sm:text-lg">{labels.assignCylinder}</h2>
        {state?.error === 'not_enough' && (
          <p className="text-sm text-red-600">{labels.notEnoughCylinders}</p>
        )}
        <input type="hidden" name="date" value={selectedDate} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.selectClient}</label>
            <select
              name="client_id"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">{labels.selectClient}</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.selectCylinderType}</label>
            <select
              name="cylinder_type_id"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">{labels.selectCylinderType}</option>
              {cylinderTypes.map((ct) => (
                <option key={ct.id} value={ct.id}>
                  {ct.name} ({ct.no_of_cylinders} {labels.available})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.quantity}</label>
            <input
              type="number"
              name="quantity"
              required
              min="1"
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
          {labels.assignCylinder}
        </button>
      </form>

      {/* Assignments grouped by client as cards */}
      {grouped.length === 0 ? (
        <p className="py-8 text-center text-gray-500">{labels.noCylinderAssignments}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {grouped.map((group) => (
            <ClientCylinderCard key={group.name} group={group} labels={labels} />
          ))}
        </div>
      )}
    </div>
  )
}

function ClientCylinderCard({
  group,
  labels,
}: {
  group: { name: string; items: AssignmentWithJoins[] }
  labels: Record<string, string>
}) {
  return (
    <div className="card space-y-3 p-4 sm:p-5">
      <h3 className="text-base font-semibold text-primary-700 sm:text-lg">{group.name}</h3>
      <div className="space-y-2">
        {group.items.map((a) => (
          <AssignmentItem key={a.id} assignment={a} labels={labels} />
        ))}
      </div>
    </div>
  )
}

function AssignmentItem({
  assignment,
  labels,
}: {
  assignment: AssignmentWithJoins
  labels: Record<string, string>
}) {
  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [editState, editAction] = useActionState(updateAssignment, { error: null as string | null })

  if (editing) {
    return (
      <div className="rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-sm">
        <form action={editAction} className="space-y-2">
          <input type="hidden" name="id" value={assignment.id} />
          <div className="flex items-center gap-2">
            <span className="font-medium">{assignment.cylinder_types.name}</span>
            <input
              type="number"
              name="quantity"
              required
              min="1"
              step="1"
              dir="ltr"
              defaultValue={assignment.quantity}
              className="w-20 rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="rounded bg-primary-600 px-2 py-1 text-xs font-medium text-white hover:bg-primary-700"
            >
              {labels.save}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded border border-gray-300 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              {labels.cancel}
            </button>
          </div>
          {editState?.error === 'not_enough' && (
            <p className="text-xs text-red-600">{labels.notEnoughCylinders}</p>
          )}
        </form>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <div>
        <span className="font-medium">{assignment.cylinder_types.name}</span>
        <span className="ms-2 text-gray-500" dir="ltr">× {assignment.quantity}</span>
      </div>
      <div className="flex items-center gap-2">
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
          <form action={deleteAssignment} className="inline-flex items-center gap-2">
            <input type="hidden" name="id" value={assignment.id} />
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
    </div>
  )
}
