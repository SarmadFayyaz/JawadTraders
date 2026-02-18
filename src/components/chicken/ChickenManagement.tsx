'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/language-context'
import { useToast } from '@/lib/toast-context'
import { CURRENCY } from '@/lib/constants'
import { addChickenRecord, deleteChickenRecord } from '@/app/chicken/actions'
import { Modal } from '@/components/ui/Modal'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { DatePicker } from '@/components/ui/DatePicker'
import type { ChickenRecord } from '@/types/database'

export function ChickenManagement({
  records,
  selectedDate,
}: {
  records: ChickenRecord[]
  selectedDate: string
}) {
  const { labels } = useLanguage()
  const { showSuccess, showError } = useToast()
  const router = useRouter()
  const [boughtModalOpen, setBoughtModalOpen] = useState(false)
  const [soldModalOpen, setSoldModalOpen] = useState(false)

  const boughtRecords = records.filter((r) => r.type === 'bought')
  const soldRecords = records.filter((r) => r.type === 'sold')

  const totalBoughtQty = boughtRecords.reduce((sum, r) => sum + r.quantity, 0)
  const totalBoughtWeight = boughtRecords.reduce((sum, r) => sum + r.weight_kg, 0)
  const totalBoughtPrice = boughtRecords.reduce((sum, r) => sum + r.price, 0)
  const totalSoldQty = soldRecords.reduce((sum, r) => sum + r.quantity, 0)
  const totalSoldWeight = soldRecords.reduce((sum, r) => sum + r.weight_kg, 0)
  const totalSoldPrice = soldRecords.reduce((sum, r) => sum + r.price, 0)
  const remainingQty = totalBoughtQty - totalSoldQty
  const remainingWeight = totalBoughtWeight - totalSoldWeight

  function handleDateChange(newDate: string) {
    router.push(`/chicken?date=${newDate}`)
  }

  async function handleBoughtSubmit(formData: FormData) {
    const result = await addChickenRecord(formData)
    if (result?.success) {
      showSuccess(labels.successSaved)
      setBoughtModalOpen(false)
    } else {
      showError(result?.error || labels.errorOccurred)
    }
  }

  async function handleSoldSubmit(formData: FormData) {
    const result = await addChickenRecord(formData)
    if (result?.success) {
      showSuccess(labels.successSaved)
      setSoldModalOpen(false)
    } else {
      showError(result?.error || labels.errorOccurred)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with buttons and date picker */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-bold sm:text-2xl">{labels.chickenManagement}</h1>
          <button
            onClick={() => setBoughtModalOpen(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            {labels.recordBought}
          </button>
          <button
            onClick={() => setSoldModalOpen(true)}
            disabled={remainingQty <= 0}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {labels.recordSold}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">{labels.date}:</label>
          <DatePicker value={selectedDate} onChange={handleDateChange} />
        </div>
      </div>

      {/* Daily Summary Cards */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        <SummaryCard label={labels.totalBought} qty={totalBoughtQty} weight={totalBoughtWeight} price={totalBoughtPrice} color="blue" />
        <SummaryCard label={labels.totalSold} qty={totalSoldQty} weight={totalSoldWeight} price={totalSoldPrice} color="green" />
        <SummaryCard label={labels.remainingQuantity} qty={remainingQty} weight={null} price={null} color="orange" />
        <SummaryCard label={labels.remainingWeight} qty={null} weight={remainingWeight} price={null} color="orange" />
      </div>

      {/* Record Bought Modal */}
      <Modal open={boughtModalOpen} onClose={() => setBoughtModalOpen(false)} title={labels.recordBought}>
        <form action={handleBoughtSubmit} className="space-y-4">
          <input type="hidden" name="type" value="bought" />
          <input type="hidden" name="date" value={selectedDate} />
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.numberOfChickens}</label>
            <input
              type="number"
              name="quantity"
              required
              min="1"
              step="1"
              dir="ltr"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.weightKg}</label>
            <input
              type="number"
              name="weight_kg"
              required
              min="0.01"
              step="0.01"
              dir="ltr"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.price}</label>
            <div className="relative">
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                defaultValue="0"
                dir="ltr"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pe-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                {CURRENCY.symbol}
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            {labels.recordBought}
          </button>
        </form>
      </Modal>

      {/* Record Sold Modal */}
      <Modal open={soldModalOpen} onClose={() => setSoldModalOpen(false)} title={labels.recordSold}>
        <form action={handleSoldSubmit} className="space-y-4">
          <input type="hidden" name="type" value="sold" />
          <input type="hidden" name="date" value={selectedDate} />
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.numberOfChickens}</label>
            <input
              type="number"
              name="quantity"
              required
              min="1"
              max={remainingQty > 0 ? remainingQty : 0}
              step="1"
              dir="ltr"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.weightKg}</label>
            <input
              type="number"
              name="weight_kg"
              required
              min="0.01"
              max={remainingWeight > 0 ? Math.round(remainingWeight * 100) / 100 : 0}
              step="0.01"
              dir="ltr"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.price}</label>
            <div className="relative">
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                defaultValue="0"
                dir="ltr"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pe-10 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                {CURRENCY.symbol}
              </span>
            </div>
          </div>
          <button
            type="submit"
            disabled={remainingQty <= 0}
            className="w-full rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {labels.recordSold}
          </button>
        </form>
      </Modal>

      {/* Records table */}
      <div className="card overflow-x-auto">
        <h2 className="mb-3 text-base font-semibold sm:text-lg">{labels.dailyTotals}</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="pb-2 pe-4 text-start font-medium">{labels.type}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.numberOfChickens}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.weightKg}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.price}</th>
              <th className="pb-2 text-start font-medium">{labels.actions}</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <RecordRow key={record.id} record={record} selectedDate={selectedDate} labels={labels} />
            ))}
          </tbody>
        </table>

        {records.length === 0 && (
          <p className="py-8 text-center text-gray-500">{labels.noData}</p>
        )}
      </div>
    </div>
  )
}

function SummaryCard({
  label,
  qty,
  weight,
  price,
  color,
}: {
  label: string
  qty: number | null
  weight: number | null
  price: number | null
  color: string
}) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700',
    orange: 'bg-orange-50 text-orange-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
  }

  return (
    <div className={`rounded-xl p-3 sm:p-4 ${colorMap[color] ?? 'bg-gray-50'}`}>
      <p className="text-xs font-medium opacity-75">{label}</p>
      <div className="mt-1 space-y-0.5">
        {qty !== null && (
          <p className="text-lg font-bold sm:text-xl" dir="ltr">{qty}</p>
        )}
        {weight !== null && (
          <p className="text-lg font-bold sm:text-xl" dir="ltr">{weight} <span className="text-xs font-normal sm:text-sm">kg</span></p>
        )}
        {price !== null && price > 0 && (
          <p className="text-xs font-medium opacity-75 sm:text-sm" dir="ltr">{CURRENCY.symbol} {price}</p>
        )}
      </div>
    </div>
  )
}

function RecordRow({
  record,
  selectedDate,
  labels,
}: {
  record: ChickenRecord
  selectedDate: string
  labels: Record<string, string>
}) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { showSuccess, showError } = useToast()

  return (
    <>
      <tr className="border-b border-gray-100">
        <td className="py-3 pe-4">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              record.type === 'bought'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {record.type === 'bought' ? labels.chickenBought : labels.chickenSold}
          </span>
        </td>
        <td className="py-3 pe-4" dir="ltr">{record.quantity}</td>
        <td className="py-3 pe-4" dir="ltr">{record.weight_kg} kg</td>
        <td className="py-3 pe-4" dir="ltr">{record.price > 0 ? `${CURRENCY.symbol} ${record.price}` : '-'}</td>
        <td className="py-3">
          <button
            onClick={() => setDeleteOpen(true)}
            className="text-red-600 hover:underline"
          >
            {labels.deleteClient}
          </button>
        </td>
      </tr>
      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          const formData = new FormData()
          formData.append('id', record.id)
          formData.append('date', selectedDate)
          const result = await deleteChickenRecord(formData)
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
