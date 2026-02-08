'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/language-context'
import { VEGETABLE_UNITS, CURRENCY } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import { addVegetable, updateVegetable, deleteVegetable } from '@/app/vegetables/actions'
import type { Vegetable, VegetableName } from '@/types/database'

export function VegetableInventory({
  vegetables,
  vegetableNames,
  selectedDate,
}: {
  vegetables: Vegetable[]
  vegetableNames: VegetableName[]
  selectedDate: string
}) {
  const { labels, dateLocale } = useLanguage()
  const router = useRouter()
  const [selectedName, setSelectedName] = useState('')

  const selectedVn = vegetableNames.find((v) => v.name === selectedName)
  const selectedUnitObj = VEGETABLE_UNITS.find((u) => u.value === selectedVn?.unit)
  const selectedUnitDisplay = selectedUnitObj ? labels[selectedUnitObj.labelKey] : ''

  function handleDateChange(newDate: string) {
    router.push(`/vegetables?date=${newDate}`)
  }

  function getUnit(vegName: string) {
    const vn = vegetableNames.find((v) => v.name === vegName)
    const unitObj = VEGETABLE_UNITS.find((u) => u.value === vn?.unit)
    return unitObj ? labels[unitObj.labelKey] : vn?.unit ?? ''
  }

  return (
    <div className="space-y-6">
      {/* Header with date filter */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-bold sm:text-2xl">{labels.vegetableInventory}</h1>
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

      {/* Add vegetable form */}
      <form action={addVegetable} className="card space-y-4 p-4 sm:p-6">
        <h2 className="text-base font-semibold sm:text-lg">{labels.addVegetable}</h2>
        <input type="hidden" name="date" value={selectedDate} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.vegetableName}</label>
            {vegetableNames.length > 0 ? (
              <select
                name="name"
                required
                value={selectedName}
                onChange={(e) => setSelectedName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">{labels.vegetableName}</option>
                {vegetableNames.map((vn) => (
                  <option key={vn.id} value={vn.name}>{vn.name}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name="name"
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.bought}</label>
            <div className="relative">
              <input
                type="number"
                name="qty_bought"
                required
                min="0.01"
                step="0.01"
                dir="ltr"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pe-14 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              {selectedUnitDisplay && (
                <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  {selectedUnitDisplay}
                </span>
              )}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{labels.priceBought}</label>
            <div className="relative">
              <input
                type="number"
                name="price_bought"
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
        </div>
        <button
          type="submit"
          className="rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          {labels.save}
        </button>
      </form>

      {/* Vegetable cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vegetables.map((veg) => {
          const remaining = veg.qty_bought - veg.qty_sold
          const unit = getUnit(veg.name)
          return (
            <VegetableCard
              key={veg.id}
              veg={veg}
              remaining={remaining}
              unit={unit}
              selectedDate={selectedDate}
              labels={labels}
            />
          )
        })}
      </div>

      {vegetables.length === 0 && (
        <div className="card">
          <p className="py-8 text-center text-gray-500">{labels.noData}</p>
        </div>
      )}
    </div>
  )
}

function VegetableCard({
  veg,
  remaining,
  unit,
  selectedDate,
  labels,
}: {
  veg: Vegetable
  remaining: number
  unit: string
  selectedDate: string
  labels: Record<string, string>
}) {
  const [confirming, setConfirming] = useState(false)
  const [showSoldModal, setShowSoldModal] = useState(false)

  return (
    <>
      <div className="card p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold sm:text-lg">{veg.name}</h3>
          {!confirming ? (
            <button
              onClick={() => setConfirming(true)}
              className="text-sm text-red-600 hover:underline"
            >
              {labels.deleteClient}
            </button>
          ) : (
            <form action={deleteVegetable} className="inline-flex items-center gap-2">
              <input type="hidden" name="id" value={veg.id} />
              <input type="hidden" name="date" value={selectedDate} />
              <button type="submit" className="text-sm font-medium text-red-700 hover:underline">
                ✓
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="text-sm font-medium text-gray-500 hover:underline"
              >
                ✕
              </button>
            </form>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="rounded-lg bg-blue-50 p-2 text-center sm:p-3">
            <p className="text-xs font-medium text-blue-600">{labels.bought}</p>
            <p className="mt-1 text-base font-bold text-blue-700 sm:text-lg" dir="ltr">{veg.qty_bought}</p>
            {unit && <p className="text-xs text-blue-500">{unit}</p>}
            {veg.price_bought > 0 && (
              <p className="mt-1 text-xs font-medium text-blue-600" dir="ltr">{CURRENCY.symbol} {veg.price_bought}</p>
            )}
          </div>
          <div className="rounded-lg bg-green-50 p-2 text-center sm:p-3">
            <p className="text-xs font-medium text-green-600">{labels.sold}</p>
            <p className="mt-1 text-base font-bold text-green-700 sm:text-lg" dir="ltr">{veg.qty_sold}</p>
            {unit && <p className="text-xs text-green-500">{unit}</p>}
            {veg.price_sold > 0 && (
              <p className="mt-1 text-xs font-medium text-green-600" dir="ltr">{CURRENCY.symbol} {veg.price_sold}</p>
            )}
          </div>
          <div className="rounded-lg bg-orange-50 p-2 text-center sm:p-3">
            <p className="text-xs font-medium text-orange-600">
              {labels.remaining}
            </p>
            <p className="mt-1 text-base font-bold text-orange-700 sm:text-lg" dir="ltr">
              {remaining}
            </p>
            {unit && <p className="text-xs text-orange-500">{unit}</p>}
          </div>
        </div>

        <button
          onClick={() => setShowSoldModal(true)}
          className="mt-3 w-full rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
        >
          {labels.sold}
        </button>
      </div>

      {showSoldModal && (
        <SoldModal
          veg={veg}
          unit={unit}
          selectedDate={selectedDate}
          labels={labels}
          onClose={() => setShowSoldModal(false)}
        />
      )}
    </>
  )
}

function SoldModal({
  veg,
  unit,
  selectedDate,
  labels,
  onClose,
}: {
  veg: Vegetable
  unit: string
  selectedDate: string
  labels: Record<string, string>
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl sm:p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold sm:text-lg">{veg.name} — {labels.sold}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form
          action={async (formData) => {
            await updateVegetable(formData)
            onClose()
          }}
          className="space-y-4"
        >
          <input type="hidden" name="id" value={veg.id} />
          <input type="hidden" name="date" value={selectedDate} />

          <div>
            <label className="mb-1 block text-sm font-medium text-green-600">{labels.sold}</label>
            <div className="relative">
              <input
                type="number"
                name="qty_sold"
                min="0"
                max={veg.qty_bought}
                step="0.01"
                defaultValue={veg.qty_sold}
                required
                dir="ltr"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pe-14 text-sm focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400"
              />
              {unit && (
                <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  {unit}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-green-600">{labels.priceSold}</label>
            <div className="relative">
              <input
                type="number"
                name="price_sold"
                min="0"
                step="0.01"
                defaultValue={veg.price_sold}
                dir="ltr"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pe-10 text-sm focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400"
              />
              <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                {CURRENCY.symbol}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
            >
              {labels.save}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              {labels.cancel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
