'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/language-context'
import { useToast } from '@/lib/toast-context'
import { CURRENCY } from '@/lib/constants'
import { Modal } from '@/components/ui/Modal'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { addSalary, updateSalary, deleteSalary } from '@/app/salary/actions'
import type { Employee, SalaryRecordWithEmployee } from '@/types/database'

const PAGE_SIZE = 10

export function SalaryPage({
  records,
  employees,
  selectedMonth,
}: {
  records: SalaryRecordWithEmployee[]
  employees: Employee[]
  selectedMonth: string
}) {
  const { labels } = useLanguage()
  const router = useRouter()
  const [nameFilter, setNameFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<SalaryRecordWithEmployee | null>(null)

  // Totals from ALL records (unfiltered)
  const totalPay = records.reduce((sum, r) => sum + r.total_pay, 0)
  const totalPaid = records.reduce((sum, r) => sum + r.paid, 0)
  const totalRemaining = records.reduce((sum, r) => sum + r.remaining, 0)

  // Filtered records
  const filteredRecords = useMemo(() => {
    if (!nameFilter) return records
    return records.filter((r) =>
      r.employees.name.toLowerCase().includes(nameFilter.toLowerCase())
    )
  }, [records, nameFilter])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE))
  const page = Math.min(currentPage, totalPages)
  const paginatedRecords = filteredRecords.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleNameFilter(value: string) {
    setNameFilter(value)
    setCurrentPage(1)
  }

  function changeMonth(offset: number) {
    const [y, m] = selectedMonth.split('-').map(Number)
    const d = new Date(y, m - 1 + offset, 1)
    const newMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    router.push(`/salary?month=${newMonth}`)
  }

  const monthDisplay = new Date(selectedMonth + '-01').toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="space-y-6">
      {/* Header with buttons and month picker */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-bold sm:text-2xl">{labels.salary}</h1>
          <button
            onClick={() => setAddModalOpen(true)}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            {labels.addSalary}
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => changeMonth(-1)}
            className="rounded-lg border border-gray-300 px-2 py-2 text-sm transition-colors hover:bg-gray-100"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="min-w-35 text-center text-sm font-medium">{monthDisplay}</span>
          <button
            onClick={() => changeMonth(1)}
            className="rounded-lg border border-gray-300 px-2 py-2 text-sm transition-colors hover:bg-gray-100"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        <div className="rounded-xl bg-blue-50 p-3 sm:p-4">
          <p className="text-xs font-medium text-blue-700 opacity-75">{labels.totalSalaries}</p>
          <p className="mt-1 text-lg font-bold text-blue-700 sm:text-xl" dir="ltr">{CURRENCY.symbol} {totalPay}</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-3 sm:p-4">
          <p className="text-xs font-medium text-emerald-700 opacity-75">{labels.totalPaidSalary}</p>
          <p className="mt-1 text-lg font-bold text-emerald-700 sm:text-xl" dir="ltr">{CURRENCY.symbol} {totalPaid}</p>
        </div>
        <div className={`rounded-xl p-3 sm:p-4 ${totalRemaining > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
          <p className={`text-xs font-medium opacity-75 ${totalRemaining > 0 ? 'text-red-700' : 'text-green-700'}`}>{labels.totalRemainingSalary}</p>
          <p className={`mt-1 text-lg font-bold sm:text-xl ${totalRemaining > 0 ? 'text-red-700' : 'text-green-700'}`} dir="ltr">{CURRENCY.symbol} {totalRemaining}</p>
        </div>
      </div>

      {/* Add Salary Modal */}
      <SalaryFormModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        employees={employees}
        records={records}
        selectedMonth={selectedMonth}
        labels={labels}
      />

      {/* Edit Salary Modal */}
      {editRecord && (
        <EditSalaryModal
          open={!!editRecord}
          onClose={() => setEditRecord(null)}
          record={editRecord}
          labels={labels}
        />
      )}

      {/* Salary Table */}
      <div className="card overflow-x-auto">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold sm:text-lg">{labels.salary}</h2>
          <input
            type="text"
            placeholder={labels.filterByName}
            value={nameFilter}
            onChange={(e) => handleNameFilter(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="pb-2 pe-4 text-start font-medium">#</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.employeeName}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.phone}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.totalPay}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.paid}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.remaining}</th>
              <th className="pb-2 text-start font-medium">{labels.actions}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRecords.map((record, idx) => (
              <SalaryRow
                key={record.id}
                record={record}
                index={(page - 1) * PAGE_SIZE + idx + 1}
                labels={labels}
                onEdit={() => setEditRecord(record)}
              />
            ))}
          </tbody>
        </table>

        {filteredRecords.length === 0 && (
          <p className="py-8 text-center text-gray-500">{labels.noSalaryRecords}</p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {labels.previous}
            </button>
            <span className="text-sm text-gray-600">
              {labels.page} {page} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {labels.next}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function SalaryFormModal({
  open,
  onClose,
  employees,
  records,
  selectedMonth,
  labels,
}: {
  open: boolean
  onClose: () => void
  employees: Employee[]
  records: SalaryRecordWithEmployee[]
  selectedMonth: string
  labels: Record<string, string>
}) {
  const { showSuccess, showError } = useToast()
  const [employeeName, setEmployeeName] = useState('')
  const [phone, setPhone] = useState('')
  const [totalPay, setTotalPay] = useState('')
  const [paidAmount, setPaidAmount] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  const remaining = (parseFloat(totalPay) || 0) - (parseFloat(paidAmount) || 0)

  function loadEmployeeData(employee: Employee) {
    setSelectedEmployee(employee)
    setPhone(employee.phone || '')
    // Pre-fill total_pay and paid from existing record for this month
    const existing = records.find((r) => r.employee_id === employee.id)
    if (existing) {
      setTotalPay(String(existing.total_pay))
      setPaidAmount(String(existing.paid))
    }
  }

  function handleEmployeeNameChange(value: string) {
    setEmployeeName(value)
    const match = employees.find(
      (e) => e.name.toLowerCase() === value.toLowerCase().trim()
    )
    if (match) {
      loadEmployeeData(match)
    } else {
      setSelectedEmployee(null)
    }
  }

  function handleEmployeeBlur() {
    const match = employees.find(
      (e) => e.name.toLowerCase() === employeeName.toLowerCase().trim()
    )
    if (match) {
      loadEmployeeData(match)
    } else {
      setSelectedEmployee(null)
    }
  }

  function resetForm() {
    setEmployeeName('')
    setPhone('')
    setTotalPay('')
    setPaidAmount('')
    setSelectedEmployee(null)
  }

  function handleClose() {
    resetForm()
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title={labels.addSalary}>
      <form
        action={async (formData) => {
          const result = await addSalary(formData)
          if (result?.success) {
            showSuccess(labels.successSaved)
            resetForm()
            onClose()
          } else if (result?.error) {
            showError(result.error || labels.errorOccurred)
          }
        }}
        className="space-y-4"
      >
        <input type="hidden" name="month" value={selectedMonth} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Employee Name with Autocomplete */}
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.employeeName}</label>
            <input
              type="text"
              name="employee_name"
              required
              value={employeeName}
              onChange={(e) => handleEmployeeNameChange(e.target.value)}
              onBlur={handleEmployeeBlur}
              list="employee-list"
              autoComplete="off"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <datalist id="employee-list">
              {employees.map((e) => (
                <option key={e.id} value={e.name} />
              ))}
            </datalist>
            {employeeName && !selectedEmployee && (
              <p className="mt-1 text-xs text-green-600">{labels.newEmployee}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.phone}</label>
            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              dir="ltr"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {/* Total Pay */}
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.totalPay}</label>
            <div className="relative">
              <input
                type="number"
                name="total_pay"
                required
                min="0"
                step="0.01"
                value={totalPay}
                onChange={(e) => setTotalPay(e.target.value)}
                dir="ltr"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pe-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                {CURRENCY.symbol}
              </span>
            </div>
          </div>

          {/* Paid */}
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.paid}</label>
            <div className="relative">
              <input
                type="number"
                name="paid"
                min="0"
                step="0.01"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                dir="ltr"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pe-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                {CURRENCY.symbol}
              </span>
            </div>
          </div>
        </div>

        {/* Remaining Display */}
        {(totalPay || paidAmount) && (
          <div className={`rounded-lg p-3 ${remaining > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
            <span className="text-sm font-medium">
              {labels.remaining}:{' '}
              <span dir="ltr" className={`font-bold ${remaining > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {CURRENCY.symbol} {remaining}
              </span>
            </span>
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          {labels.addSalary}
        </button>
      </form>
    </Modal>
  )
}

function EditSalaryModal({
  open,
  onClose,
  record,
  labels,
}: {
  open: boolean
  onClose: () => void
  record: SalaryRecordWithEmployee
  labels: Record<string, string>
}) {
  const { showSuccess, showError } = useToast()
  const [phone, setPhone] = useState(record.employees.phone || '')
  const [totalPay, setTotalPay] = useState(String(record.total_pay))
  const [paidAmount, setPaidAmount] = useState(String(record.paid))

  const remaining = (parseFloat(totalPay) || 0) - (parseFloat(paidAmount) || 0)

  return (
    <Modal open={open} onClose={onClose} title={labels.editSalary}>
      <form
        action={async (formData) => {
          const result = await updateSalary(formData)
          if (result?.success) {
            showSuccess(labels.successSaved)
            onClose()
          } else if (result?.error) {
            showError(result.error || labels.errorOccurred)
          }
        }}
        className="space-y-4"
      >
        <input type="hidden" name="id" value={record.id} />
        <input type="hidden" name="employee_id" value={record.employee_id} />

        {/* Employee Name (read-only) */}
        <div>
          <label className="mb-1 block text-sm font-medium">{labels.employeeName}</label>
          <input
            type="text"
            value={record.employees.name}
            disabled
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Phone Number */}
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.phone}</label>
            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              dir="ltr"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {/* Total Pay */}
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.totalPay}</label>
            <div className="relative">
              <input
                type="number"
                name="total_pay"
                required
                min="0"
                step="0.01"
                value={totalPay}
                onChange={(e) => setTotalPay(e.target.value)}
                dir="ltr"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pe-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                {CURRENCY.symbol}
              </span>
            </div>
          </div>

          {/* Paid */}
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.paid}</label>
            <div className="relative">
              <input
                type="number"
                name="paid"
                min="0"
                step="0.01"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                dir="ltr"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pe-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                {CURRENCY.symbol}
              </span>
            </div>
          </div>
        </div>

        {/* Remaining Display */}
        <div className={`rounded-lg p-3 ${remaining > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
          <span className="text-sm font-medium">
            {labels.remaining}:{' '}
            <span dir="ltr" className={`font-bold ${remaining > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {CURRENCY.symbol} {remaining}
            </span>
          </span>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          {labels.save}
        </button>
      </form>
    </Modal>
  )
}

function SalaryRow({
  record,
  index,
  labels,
  onEdit,
}: {
  record: SalaryRecordWithEmployee
  index: number
  labels: Record<string, string>
  onEdit: () => void
}) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { showSuccess, showError } = useToast()

  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 pe-4">{index}</td>
      <td className="py-3 pe-4">{record.employees.name}</td>
      <td className="py-3 pe-4" dir="ltr">{record.employees.phone || '-'}</td>
      <td className="py-3 pe-4" dir="ltr">{CURRENCY.symbol} {record.total_pay}</td>
      <td className="py-3 pe-4" dir="ltr">{CURRENCY.symbol} {record.paid}</td>
      <td className="py-3 pe-4" dir="ltr">
        <span className={record.remaining > 0 ? 'font-medium text-red-600' : 'text-green-600'}>
          {CURRENCY.symbol} {record.remaining}
        </span>
      </td>
      <td className="py-3">
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-primary-600 hover:underline"
          >
            {labels.editSalary}
          </button>
          <button
            onClick={() => setDeleteOpen(true)}
            className="text-red-600 hover:underline"
          >
            {labels.deleteClient}
          </button>
        </div>
        <ConfirmModal
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={async () => {
            const formData = new FormData()
            formData.append('id', record.id)
            const result = await deleteSalary(formData)
            if (result?.success) {
              showSuccess(labels.successDeleted)
              setDeleteOpen(false)
            } else if (result?.error) {
              showError(result.error || labels.errorOccurred)
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
