'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/language-context'
import { useToast } from '@/lib/toast-context'
import { CURRENCY } from '@/lib/constants'
import { Modal } from '@/components/ui/Modal'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { DatePicker } from '@/components/ui/DatePicker'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import { saveDayOpening, addDailySale, deleteDailySale } from '@/app/daily-sales/actions'
import type { Customer, DailySaleSheet, DailySaleWithCustomer, SaleType } from '@/types/database'

const PAGE_SIZE = 10

export function DailySalesPage({
  sheet,
  sales,
  customers,
  selectedDate,
}: {
  sheet: DailySaleSheet | null
  sales: DailySaleWithCustomer[]
  customers: Customer[]
  selectedDate: string
}) {
  const { labels } = useLanguage()
  const router = useRouter()
  const [nameFilter, setNameFilter] = useState('')
  const [phoneFilter, setPhoneFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [saleModalOpen, setSaleModalOpen] = useState(false)
  const [openingModalOpen, setOpeningModalOpen] = useState(false)

  // Totals from ALL sales (unfiltered)
  const totalAmount = sales.reduce((sum, s) => sum + s.total_amount, 0)
  const totalPaid = sales.reduce((sum, s) => sum + s.paid, 0)
  const totalRemaining = sales.reduce((sum, s) => sum + s.remaining, 0)

  // Filtered sales
  const filteredSales = useMemo(() => {
    let result = sales
    if (nameFilter) {
      result = result.filter((s) =>
        s.customers.name.toLowerCase().includes(nameFilter.toLowerCase())
      )
    }
    if (phoneFilter) {
      result = result.filter((s) =>
        s.customers.phone?.includes(phoneFilter)
      )
    }
    return result
  }, [sales, nameFilter, phoneFilter])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredSales.length / PAGE_SIZE))
  const page = Math.min(currentPage, totalPages)
  const paginatedSales = filteredSales.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Reset page when filters change
  function handleNameFilter(value: string) {
    setNameFilter(value)
    setCurrentPage(1)
  }
  function handlePhoneFilter(value: string) {
    setPhoneFilter(value)
    setCurrentPage(1)
  }

  function handleDateChange(newDate: string) {
    router.push(`/daily-sales?date=${newDate}`)
  }

  return (
    <div className="space-y-6">
      {/* Header with buttons and date picker */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-bold sm:text-2xl">{labels.dailySales}</h1>
          <button
            onClick={() => setOpeningModalOpen(true)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
          >
            {labels.openingStock}
          </button>
          <button
            onClick={() => setSaleModalOpen(true)}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            {labels.addSale}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">{labels.date}:</label>
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>
      </div>

      {/* Summary Cards - Row 1: Opening Stock */}
      {sheet && (
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="rounded-xl bg-blue-50 p-3 sm:p-4">
            <p className="text-xs font-medium text-blue-700 opacity-75">{labels.totalCylindersOpening}</p>
            <p className="mt-1 text-lg font-bold text-blue-700 sm:text-xl" dir="ltr">{sheet.total_cylinders}</p>
          </div>
          <div className="rounded-xl bg-cyan-50 p-3 sm:p-4">
            <p className="text-xs font-medium text-cyan-700 opacity-75">{labels.totalGasKg}</p>
            <p className="mt-1 text-lg font-bold text-cyan-700 sm:text-xl" dir="ltr">{sheet.total_gas_kg} <span className="text-xs font-normal sm:text-sm">kg</span></p>
          </div>
        </div>
      )}

      {/* Summary Cards - Row 2: Sales Totals */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="rounded-xl bg-green-50 p-3 sm:p-4">
          <p className="text-xs font-medium text-green-700 opacity-75">{labels.totalSale}</p>
          <p className="mt-1 text-lg font-bold text-green-700 sm:text-xl" dir="ltr">{CURRENCY.symbol} {totalAmount}</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-3 sm:p-4">
          <p className="text-xs font-medium text-emerald-700 opacity-75">{labels.totalPaid}</p>
          <p className="mt-1 text-lg font-bold text-emerald-700 sm:text-xl" dir="ltr">{CURRENCY.symbol} {totalPaid}</p>
        </div>
        <div className={`rounded-xl p-3 sm:p-4 ${totalRemaining > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
          <p className={`text-xs font-medium opacity-75 ${totalRemaining > 0 ? 'text-red-700' : 'text-green-700'}`}>{labels.totalRemaining}</p>
          <p className={`mt-1 text-lg font-bold sm:text-xl ${totalRemaining > 0 ? 'text-red-700' : 'text-green-700'}`} dir="ltr">{CURRENCY.symbol} {totalRemaining}</p>
        </div>
      </div>

      {/* Opening Stock Modal */}
      <OpeningStockModal
        open={openingModalOpen}
        onClose={() => setOpeningModalOpen(false)}
        sheet={sheet}
        selectedDate={selectedDate}
        labels={labels}
      />

      {/* Add Sale Modal */}
      <SaleFormModal
        open={saleModalOpen}
        onClose={() => setSaleModalOpen(false)}
        customers={customers}
        selectedDate={selectedDate}
        labels={labels}
      />

      {/* Today's Sales Table */}
      <div className="card overflow-x-auto">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold sm:text-lg">{labels.dailyTotals}</h2>
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder={labels.filterByName}
              value={nameFilter}
              onChange={(e) => handleNameFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <input
              type="text"
              placeholder={labels.filterByPhone}
              value={phoneFilter}
              onChange={(e) => handlePhoneFilter(e.target.value)}
              dir="ltr"
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="pb-2 pe-4 text-start font-medium">#</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.customerName}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.phoneNumber}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.saleType}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.totalAmount}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.paid}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.remaining}</th>
              <th className="pb-2 text-start font-medium">{labels.actions}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSales.map((sale, idx) => (
              <SaleRow
                key={sale.id}
                sale={sale}
                index={(page - 1) * PAGE_SIZE + idx + 1}
                selectedDate={selectedDate}
                labels={labels}
              />
            ))}
          </tbody>
        </table>

        {filteredSales.length === 0 && (
          <p className="py-8 text-center text-gray-500">{labels.noDailySales}</p>
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

function OpeningStockModal({
  open,
  onClose,
  sheet,
  selectedDate,
  labels,
}: {
  open: boolean
  onClose: () => void
  sheet: DailySaleSheet | null
  selectedDate: string
  labels: Record<string, string>
}) {
  const { showSuccess, showError } = useToast()

  return (
    <Modal open={open} onClose={onClose} title={labels.openingStock}>
      <form
        action={async (formData) => {
          const result = await saveDayOpening(formData)
          if (result?.success) {
            showSuccess(labels.successSaved)
            onClose()
          } else if (result?.error) {
            showError(result.error || labels.errorOccurred)
          }
        }}
        className="space-y-4"
      >
        <input type="hidden" name="date" value={selectedDate} />
        <div>
          <label className="mb-1 block text-sm font-medium">{labels.totalCylindersOpening}</label>
          <input
            type="number"
            name="total_cylinders"
            required
            min="0"
            step="1"
            defaultValue={sheet?.total_cylinders ?? ''}
            dir="ltr"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">{labels.totalGasKg}</label>
          <input
            type="number"
            name="total_gas_kg"
            required
            min="0"
            step="0.01"
            defaultValue={sheet?.total_gas_kg ?? ''}
            dir="ltr"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          {labels.saveDayOpening}
        </button>
      </form>
    </Modal>
  )
}

function SaleFormModal({
  open,
  onClose,
  customers,
  selectedDate,
  labels,
}: {
  open: boolean
  onClose: () => void
  customers: Customer[]
  selectedDate: string
  labels: Record<string, string>
}) {
  const { showSuccess, showError } = useToast()
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [saleType, setSaleType] = useState<SaleType>('gas')
  const [gasKg, setGasKg] = useState('')
  const [totalAmount, setTotalAmount] = useState('')
  const [paidAmount, setPaidAmount] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const remaining = (parseFloat(totalAmount) || 0) - (parseFloat(paidAmount) || 0)

  function handleCustomerNameChange(value: string) {
    setCustomerName(value)
    const match = customers.find(
      (c) => c.name.toLowerCase() === value.toLowerCase().trim()
    )
    if (match) {
      setSelectedCustomer(match)
      setPhone(match.phone || '')
    } else {
      setSelectedCustomer(null)
    }
  }

  function handleCustomerBlur() {
    const match = customers.find(
      (c) => c.name.toLowerCase() === customerName.toLowerCase().trim()
    )
    if (match) {
      setSelectedCustomer(match)
      setPhone(match.phone || '')
    } else {
      setSelectedCustomer(null)
    }
  }

  function resetForm() {
    setCustomerName('')
    setPhone('')
    setSaleType('gas')
    setGasKg('')
    setTotalAmount('')
    setPaidAmount('')
    setSelectedCustomer(null)
  }

  function handleClose() {
    resetForm()
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title={labels.addSale}>
      <form
        action={async (formData) => {
          const result = await addDailySale(formData)
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
        <input type="hidden" name="date" value={selectedDate} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Customer Name with Autocomplete */}
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.customerName}</label>
            <input
              type="text"
              name="customer_name"
              required
              value={customerName}
              onChange={(e) => handleCustomerNameChange(e.target.value)}
              onBlur={handleCustomerBlur}
              list="customer-list"
              autoComplete="off"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <datalist id="customer-list">
              {customers.map((c) => (
                <option key={c.id} value={c.name} />
              ))}
            </datalist>
            {selectedCustomer && (
              <p className="mt-1 text-xs text-blue-600">
                {labels.customerBalance}: {CURRENCY.symbol} {selectedCustomer.balance}
              </p>
            )}
            {customerName && !selectedCustomer && (
              <p className="mt-1 text-xs text-green-600">{labels.newCustomer}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.phoneNumber}</label>
            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              dir="ltr"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {/* Sale Type */}
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.saleType}</label>
            <SearchableSelect
              name="sale_type"
              value={saleType}
              onChange={(v) => setSaleType(v as SaleType)}
              options={[
                { value: 'gas', label: labels.gas },
                { value: 'other', label: labels.other },
              ]}
            />
          </div>

          {/* Gas KG - only shown when sale type is gas */}
          {saleType === 'gas' && (
            <div>
              <label className="mb-1 block text-sm font-medium">{labels.gasKgSold}</label>
              <input
                type="number"
                name="gas_kg"
                min="0"
                step="0.01"
                value={gasKg}
                onChange={(e) => setGasKg(e.target.value)}
                dir="ltr"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          )}

          {/* Total Amount */}
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.totalAmount}</label>
            <div className="relative">
              <input
                type="number"
                name="total_amount"
                required
                min="0"
                step="0.01"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
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
        {(totalAmount || paidAmount) && (
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
          {labels.addSale}
        </button>
      </form>
    </Modal>
  )
}

function SaleRow({
  sale,
  index,
  selectedDate,
  labels,
}: {
  sale: DailySaleWithCustomer
  index: number
  selectedDate: string
  labels: Record<string, string>
}) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { showSuccess, showError } = useToast()

  const typeLabel = sale.sale_type === 'gas' ? labels.gas : labels.other
  const typeColor = sale.sale_type === 'gas' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'

  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 pe-4">{index}</td>
      <td className="py-3 pe-4">{sale.customers.name}</td>
      <td className="py-3 pe-4" dir="ltr">{sale.customers.phone || '-'}</td>
      <td className="py-3 pe-4">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeColor}`}>
          {typeLabel}
        </span>
        {sale.sale_type === 'gas' && sale.gas_kg && (
          <span className="ms-1 text-xs text-gray-500" dir="ltr">{sale.gas_kg} kg</span>
        )}
      </td>
      <td className="py-3 pe-4" dir="ltr">{CURRENCY.symbol} {sale.total_amount}</td>
      <td className="py-3 pe-4" dir="ltr">{CURRENCY.symbol} {sale.paid}</td>
      <td className="py-3 pe-4" dir="ltr">
        <span className={sale.remaining > 0 ? 'font-medium text-red-600' : 'text-green-600'}>
          {CURRENCY.symbol} {sale.remaining}
        </span>
      </td>
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
            formData.append('id', sale.id)
            formData.append('date', selectedDate)
            const result = await deleteDailySale(formData)
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
