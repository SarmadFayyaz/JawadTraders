'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/language-context'
import { useToast } from '@/lib/toast-context'
import { assignCylinder, updateAssignment, deleteAssignment } from '@/app/cylinders/actions'
import { Modal } from '@/components/ui/Modal'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { DatePicker } from '@/components/ui/DatePicker'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
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
  const { showSuccess, showError } = useToast()
  const router = useRouter()
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [assignError, setAssignError] = useState<string | null>(null)

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

  async function handleAssignSubmit(formData: FormData) {
    setAssignError(null)
    const result = await assignCylinder(formData)
    if (result?.success) {
      showSuccess(labels.successSaved)
      setAssignModalOpen(false)
    } else if (result?.error === 'not_enough') {
      setAssignError('not_enough')
    } else {
      showError(result?.error || labels.errorOccurred)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with buttons and date picker */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-bold sm:text-2xl">{labels.cylinderAssignments}</h1>
          <button
            onClick={() => { setAssignError(null); setAssignModalOpen(true) }}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            {labels.assignCylinder}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">{labels.date}:</label>
          <DatePicker
            value={selectedDate}
            onChange={(date) => router.push(`/cylinders?date=${date}`)}
          />
        </div>
      </div>

      {/* Summary Cards - Row 1: Totals */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="rounded-xl bg-purple-50 p-3 sm:p-4">
          <p className="text-xs font-medium text-purple-700 opacity-75">{labels.total}</p>
          <p className="mt-1 text-lg font-bold text-purple-700 sm:text-xl" dir="ltr">{totalInventory}</p>
        </div>
        <div className="rounded-xl bg-blue-50 p-3 sm:p-4">
          <p className="text-xs font-medium text-blue-700 opacity-75">{labels.assigned}</p>
          <p className="mt-1 text-lg font-bold text-blue-700 sm:text-xl" dir="ltr">{totalAssigned}</p>
        </div>
        <div className="rounded-xl bg-gray-50 p-3 sm:p-4">
          <p className="text-xs font-medium text-gray-600 opacity-75">{labels.unassigned}</p>
          <p className="mt-1 text-lg font-bold text-gray-600 sm:text-xl" dir="ltr">{totalInventory - totalAssigned}</p>
        </div>
      </div>

      {/* Summary Cards - Row 2: Per Type */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 sm:gap-3">
        {cylinderTypes.map((ct) => {
          const assigned = assignedByType.get(ct.id) || 0
          const unassigned = ct.no_of_cylinders
          const total = assigned + unassigned
          return (
            <div key={ct.id} className="card p-3 sm:p-4">
              <p className="mb-3 text-sm font-semibold">{ct.name}</p>
              <div className="flex items-center justify-between" dir="ltr">
                <div className="text-center">
                  <p className="text-xl font-bold text-blue-700">{assigned}</p>
                  <p className="text-[10px] text-gray-500">{labels.assigned}</p>
                </div>
                <span className="text-lg text-gray-300">+</span>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-600">{unassigned}</p>
                  <p className="text-[10px] text-gray-500">{labels.unassigned}</p>
                </div>
                <span className="text-lg text-gray-300">=</span>
                <div className="text-center">
                  <p className="text-xl font-bold text-purple-700">{total}</p>
                  <p className="text-[10px] text-gray-500">{labels.total}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Assign Cylinder Modal */}
      <Modal open={assignModalOpen} onClose={() => setAssignModalOpen(false)} title={labels.assignCylinder}>
        <form action={handleAssignSubmit} className="space-y-4">
          {assignError === 'not_enough' && (
            <p className="text-sm text-red-600">{labels.notEnoughCylinders}</p>
          )}
          <input type="hidden" name="date" value={selectedDate} />
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.selectClient}</label>
            <SearchableSelect
              name="client_id"
              required
              placeholder={labels.selectClient}
              options={clients.map((c) => ({ value: c.id, label: c.name }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.selectCylinderType}</label>
            <SearchableSelect
              name="cylinder_type_id"
              required
              placeholder={labels.selectCylinderType}
              options={cylinderTypes.map((ct) => ({ value: ct.id, label: `${ct.name} (${ct.no_of_cylinders} ${labels.available})` }))}
            />
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
          <button
            type="submit"
            className="w-full rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            {labels.assignCylinder}
          </button>
        </form>
      </Modal>

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
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const { showSuccess, showError } = useToast()

  async function handleEditSubmit(formData: FormData) {
    setEditError(null)
    const result = await updateAssignment(formData)
    if (result?.success) {
      showSuccess(labels.successSaved)
      setEditModalOpen(false)
    } else if (result?.error === 'not_enough') {
      setEditError('not_enough')
    } else {
      showError(result?.error || labels.errorOccurred)
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary-700" dir="ltr">{assignment.quantity}</span>
          <span className="font-medium text-gray-700">{assignment.cylinder_types.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setEditError(null); setEditModalOpen(true) }}
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
      </div>

      {/* Edit Assignment Modal */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} title={labels.editCylinderType}>
        <form action={handleEditSubmit} className="space-y-4">
          <input type="hidden" name="id" value={assignment.id} />
          {editError === 'not_enough' && (
            <p className="text-sm text-red-600">{labels.notEnoughCylinders}</p>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium">{assignment.cylinder_types.name}</label>
            <input
              type="number"
              name="quantity"
              required
              min="1"
              step="1"
              dir="ltr"
              defaultValue={assignment.quantity}
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
          formData.append('id', assignment.id)
          const result = await deleteAssignment(formData)
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
