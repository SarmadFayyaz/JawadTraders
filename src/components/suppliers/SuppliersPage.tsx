'use client'

import { useState, useMemo } from 'react'
import { useLanguage } from '@/lib/language-context'
import { useToast } from '@/lib/toast-context'
import { CURRENCY } from '@/lib/constants'
import { Modal } from '@/components/ui/Modal'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { addSupplier, updateSupplier, deleteSupplier } from '@/app/suppliers/actions'
import type { Supplier } from '@/types/database'

const PAGE_SIZE = 10

export function SuppliersPage({
  suppliers,
}: {
  suppliers: Supplier[]
}) {
  const { labels } = useLanguage()
  const [nameFilter, setNameFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editSupplierData, setEditSupplierData] = useState<Supplier | null>(null)

  // Totals from ALL suppliers (unfiltered)
  const totalBill = suppliers.reduce((sum, s) => sum + s.total_bill, 0)
  const totalPaid = suppliers.reduce((sum, s) => sum + s.paid, 0)
  const totalRemaining = suppliers.reduce((sum, s) => sum + s.remaining, 0)

  // Filtered suppliers
  const filteredSuppliers = useMemo(() => {
    if (!nameFilter) return suppliers
    return suppliers.filter((s) =>
      s.name.toLowerCase().includes(nameFilter.toLowerCase())
    )
  }, [suppliers, nameFilter])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredSuppliers.length / PAGE_SIZE))
  const page = Math.min(currentPage, totalPages)
  const paginatedSuppliers = filteredSuppliers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleNameFilter(value: string) {
    setNameFilter(value)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-bold sm:text-2xl">{labels.suppliers}</h1>
          <button
            onClick={() => setAddModalOpen(true)}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            {labels.addSupplier}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="rounded-xl bg-blue-50 p-3 sm:p-4">
          <p className="text-xs font-medium text-blue-700 opacity-75">{labels.totalBill}</p>
          <p className="mt-1 text-lg font-bold text-blue-700 sm:text-xl" dir="ltr">{CURRENCY.symbol} {totalBill}</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-3 sm:p-4">
          <p className="text-xs font-medium text-emerald-700 opacity-75">{labels.totalPaidSupplier}</p>
          <p className="mt-1 text-lg font-bold text-emerald-700 sm:text-xl" dir="ltr">{CURRENCY.symbol} {totalPaid}</p>
        </div>
        <div className={`rounded-xl p-3 sm:p-4 ${totalRemaining > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
          <p className={`text-xs font-medium opacity-75 ${totalRemaining > 0 ? 'text-red-700' : 'text-green-700'}`}>{labels.totalRemainingSupplier}</p>
          <p className={`mt-1 text-lg font-bold sm:text-xl ${totalRemaining > 0 ? 'text-red-700' : 'text-green-700'}`} dir="ltr">{CURRENCY.symbol} {totalRemaining}</p>
        </div>
      </div>

      {/* Add Supplier Modal */}
      <SupplierFormModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        suppliers={suppliers}
        labels={labels}
      />

      {/* Edit Supplier Modal */}
      {editSupplierData && (
        <EditSupplierModal
          open={!!editSupplierData}
          onClose={() => setEditSupplierData(null)}
          supplier={editSupplierData}
          labels={labels}
        />
      )}

      {/* Suppliers Table */}
      <div className="card overflow-x-auto">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold sm:text-lg">{labels.suppliers}</h2>
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
              <th className="pb-2 pe-4 text-start font-medium">{labels.supplierName}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.phone}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.totalBill}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.paid}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.remaining}</th>
              <th className="pb-2 text-start font-medium">{labels.actions}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSuppliers.map((supplier, idx) => (
              <SupplierRow
                key={supplier.id}
                supplier={supplier}
                index={(page - 1) * PAGE_SIZE + idx + 1}
                labels={labels}
                onEdit={() => setEditSupplierData(supplier)}
              />
            ))}
          </tbody>
        </table>

        {filteredSuppliers.length === 0 && (
          <p className="py-8 text-center text-gray-500">{labels.noSuppliers}</p>
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

function SupplierFormModal({
  open,
  onClose,
  suppliers,
  labels,
}: {
  open: boolean
  onClose: () => void
  suppliers: Supplier[]
  labels: Record<string, string>
}) {
  const { showSuccess, showError } = useToast()
  const [supplierName, setSupplierName] = useState('')
  const [phone, setPhone] = useState('')
  const [totalBill, setTotalBill] = useState('')
  const [paidAmount, setPaidAmount] = useState('')
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)

  const remaining = (parseFloat(totalBill) || 0) - (parseFloat(paidAmount) || 0)

  function loadSupplierData(supplier: Supplier) {
    setSelectedSupplier(supplier)
    setPhone(supplier.phone || '')
    setTotalBill(String(supplier.total_bill))
    setPaidAmount(String(supplier.paid))
  }

  function handleSupplierNameChange(value: string) {
    setSupplierName(value)
    const match = suppliers.find(
      (s) => s.name.toLowerCase() === value.toLowerCase().trim()
    )
    if (match) {
      loadSupplierData(match)
    } else {
      setSelectedSupplier(null)
    }
  }

  function handleSupplierBlur() {
    const match = suppliers.find(
      (s) => s.name.toLowerCase() === supplierName.toLowerCase().trim()
    )
    if (match) {
      loadSupplierData(match)
    } else {
      setSelectedSupplier(null)
    }
  }

  function resetForm() {
    setSupplierName('')
    setPhone('')
    setTotalBill('')
    setPaidAmount('')
    setSelectedSupplier(null)
  }

  function handleClose() {
    resetForm()
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title={labels.addSupplier}>
      <form
        action={async (formData) => {
          const result = await addSupplier(formData)
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Supplier Name with Autocomplete */}
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.supplierName}</label>
            <input
              type="text"
              name="name"
              required
              value={supplierName}
              onChange={(e) => handleSupplierNameChange(e.target.value)}
              onBlur={handleSupplierBlur}
              list="supplier-list"
              autoComplete="off"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <datalist id="supplier-list">
              {suppliers.map((s) => (
                <option key={s.id} value={s.name} />
              ))}
            </datalist>
            {supplierName && !selectedSupplier && (
              <p className="mt-1 text-xs text-green-600">{labels.newSupplier}</p>
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

          {/* Total Bill */}
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.totalBill}</label>
            <div className="relative">
              <input
                type="number"
                name="total_bill"
                required
                min="0"
                step="0.01"
                value={totalBill}
                onChange={(e) => setTotalBill(e.target.value)}
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
        {(totalBill || paidAmount) && (
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
          {labels.addSupplier}
        </button>
      </form>
    </Modal>
  )
}

function EditSupplierModal({
  open,
  onClose,
  supplier,
  labels,
}: {
  open: boolean
  onClose: () => void
  supplier: Supplier
  labels: Record<string, string>
}) {
  const { showSuccess, showError } = useToast()
  const [phone, setPhone] = useState(supplier.phone || '')
  const [totalBill, setTotalBill] = useState(String(supplier.total_bill))
  const [paidAmount, setPaidAmount] = useState(String(supplier.paid))

  const remaining = (parseFloat(totalBill) || 0) - (parseFloat(paidAmount) || 0)

  return (
    <Modal open={open} onClose={onClose} title={labels.editSupplier}>
      <form
        action={async (formData) => {
          const result = await updateSupplier(formData)
          if (result?.success) {
            showSuccess(labels.successSaved)
            onClose()
          } else if (result?.error) {
            showError(result.error || labels.errorOccurred)
          }
        }}
        className="space-y-4"
      >
        <input type="hidden" name="id" value={supplier.id} />

        {/* Supplier Name (read-only) */}
        <div>
          <label className="mb-1 block text-sm font-medium">{labels.supplierName}</label>
          <input
            type="text"
            value={supplier.name}
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

          {/* Total Bill */}
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.totalBill}</label>
            <div className="relative">
              <input
                type="number"
                name="total_bill"
                required
                min="0"
                step="0.01"
                value={totalBill}
                onChange={(e) => setTotalBill(e.target.value)}
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

function SupplierRow({
  supplier,
  index,
  labels,
  onEdit,
}: {
  supplier: Supplier
  index: number
  labels: Record<string, string>
  onEdit: () => void
}) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { showSuccess, showError } = useToast()

  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 pe-4">{index}</td>
      <td className="py-3 pe-4">{supplier.name}</td>
      <td className="py-3 pe-4" dir="ltr">{supplier.phone || '-'}</td>
      <td className="py-3 pe-4" dir="ltr">{CURRENCY.symbol} {supplier.total_bill}</td>
      <td className="py-3 pe-4" dir="ltr">{CURRENCY.symbol} {supplier.paid}</td>
      <td className="py-3 pe-4" dir="ltr">
        <span className={supplier.remaining > 0 ? 'font-medium text-red-600' : 'text-green-600'}>
          {CURRENCY.symbol} {supplier.remaining}
        </span>
      </td>
      <td className="py-3">
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-primary-600 hover:underline"
          >
            {labels.editSupplier}
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
            formData.append('id', supplier.id)
            const result = await deleteSupplier(formData)
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
