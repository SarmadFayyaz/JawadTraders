'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/language-context'
import { formatDate } from '@/lib/utils'
import { CURRENCY } from '@/lib/constants'
import { addChickenRecord, deleteChickenRecord } from '@/app/chicken/actions'
import type { ChickenRecord } from '@/types/database'

export function ChickenManagement({
  records,
  selectedDate,
}: {
  records: ChickenRecord[]
  selectedDate: string
}) {
  const { labels, dateLocale } = useLanguage()
  const router = useRouter()

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

  return (
    <div className="space-y-6">
      {/* Header with date filter */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-bold sm:text-2xl">{labels.chickenManagement}</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">{labels.date}:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            dir="ltr"
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      <p className="text-sm text-gray-500">{formatDate(selectedDate, dateLocale)}</p>

      {/* Daily Summary Cards */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        <SummaryCard label={labels.totalBought} qty={totalBoughtQty} weight={totalBoughtWeight} price={totalBoughtPrice} color="blue" />
        <SummaryCard label={labels.totalSold} qty={totalSoldQty} weight={totalSoldWeight} price={totalSoldPrice} color="green" />
        <SummaryCard label={labels.remainingQuantity} qty={remainingQty} weight={null} price={null} color="orange" />
        <SummaryCard label={labels.remainingWeight} qty={null} weight={remainingWeight} price={null} color="orange" />
      </div>

      {/* Two forms side by side */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Record Bought */}
        <form action={addChickenRecord} className="card space-y-4 p-4 sm:p-6">
          <h2 className="text-base font-semibold text-blue-700 sm:text-lg">{labels.recordBought}</h2>
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
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
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
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
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
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pe-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
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

        {/* Record Sold */}
        <form action={addChickenRecord} className="card space-y-4 p-4 sm:p-6">
          <h2 className="text-base font-semibold text-green-700 sm:text-lg">{labels.recordSold}</h2>
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
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
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
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
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
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pe-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
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
      </div>

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
  const [confirming, setConfirming] = useState(false)

  return (
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
        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="text-red-600 hover:underline"
          >
            {labels.deleteClient}
          </button>
        ) : (
          <form action={deleteChickenRecord} className="inline-flex gap-2">
            <input type="hidden" name="id" value={record.id} />
            <input type="hidden" name="date" value={selectedDate} />
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
      </td>
    </tr>
  )
}
