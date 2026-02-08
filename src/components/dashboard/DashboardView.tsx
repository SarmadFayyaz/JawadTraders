'use client'

import { useLanguage } from '@/lib/language-context'
import { CURRENCY } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import type { ChickenRecord, CylinderType, Vegetable } from '@/types/database'

interface AssignmentWithType {
  id: string
  cylinder_type_id: string
  quantity: number
  date: string
  cylinder_types: { name: string }
}

export function DashboardView({
  assignments,
  cylinderTypes,
  vegetables,
  chickenRecords,
  today,
}: {
  assignments: AssignmentWithType[]
  cylinderTypes: CylinderType[]
  vegetables: Vegetable[]
  chickenRecords: ChickenRecord[]
  today: string
}) {
  const { labels, dateLocale } = useLanguage()

  // Cylinder summary: no_of_cylinders is current available (decremented by assignments)
  // total = available + today's assigned
  const assignedByType = new Map<string, number>()
  for (const a of assignments) {
    const name = a.cylinder_types.name
    assignedByType.set(name, (assignedByType.get(name) || 0) + a.quantity)
  }
  const totalAssigned = assignments.reduce((sum, a) => sum + a.quantity, 0)
  const totalAll = cylinderTypes.reduce((sum, ct) => sum + ct.no_of_cylinders, 0) + totalAssigned
  const totalUnassigned = totalAll - totalAssigned
  const byType = new Map<string, { assigned: number; total: number }>()
  for (const ct of cylinderTypes) {
    const assigned = assignedByType.get(ct.name) || 0
    byType.set(ct.name, { assigned, total: ct.no_of_cylinders + assigned })
  }

  // Vegetable summary
  const vegBuyPrice = vegetables.reduce((sum, v) => sum + v.price_bought, 0)
  const vegSellPrice = vegetables.reduce((sum, v) => sum + v.price_sold, 0)
  const vegProfit = vegSellPrice - vegBuyPrice

  // Chicken summary
  const chickenBought = chickenRecords.filter((r) => r.type === 'bought')
  const chickenSold = chickenRecords.filter((r) => r.type === 'sold')
  const chickenBoughtQty = chickenBought.reduce((sum, r) => sum + r.quantity, 0)
  const chickenBoughtWeight = chickenBought.reduce((sum, r) => sum + r.weight_kg, 0)
  const chickenBoughtPrice = chickenBought.reduce((sum, r) => sum + r.price, 0)
  const chickenSoldQty = chickenSold.reduce((sum, r) => sum + r.quantity, 0)
  const chickenSoldWeight = chickenSold.reduce((sum, r) => sum + r.weight_kg, 0)
  const chickenSoldPrice = chickenSold.reduce((sum, r) => sum + r.price, 0)
  const chickenProfit = chickenSoldPrice - chickenBoughtPrice

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-bold sm:text-2xl">{labels.todaySummary}</h1>
        <p className="text-sm text-gray-500">{formatDate(today, dateLocale)}</p>
      </div>

      {/* Cylinders Assigned Today */}
      <div className="card p-4 sm:p-6">
        <h2 className="mb-4 text-base font-semibold sm:text-lg">{labels.cylindersAssignedToday}</h2>
        {byType.size > 0 ? (
          <div className="flex gap-3 overflow-x-auto">
            <div className="min-w-25 shrink-0 rounded-xl bg-gray-50 p-3 text-center sm:p-4">
              <p className="text-xs font-medium text-gray-600">{labels.totalCylinders}</p>
              <p className="mt-1 text-2xl font-bold sm:text-3xl text-gray-700" dir="ltr">{totalAll}</p>
              <p className="text-xs text-blue-600" dir="ltr">{labels.assigned}: {totalAssigned}</p>
              <p className={`text-xs ${totalUnassigned >= 0 ? 'text-green-600' : 'text-red-600'}`} dir="ltr">{labels.unassigned}: {totalUnassigned}</p>
            </div>
            {[...byType.entries()].map(([name, { assigned, total }]) => {
              const unassigned = total - assigned
              return (
                <div key={name} className="min-w-25 shrink-0 rounded-xl bg-gray-50 p-3 text-center sm:p-4">
                  <p className="text-xs font-medium text-gray-500">{name}</p>
                  <p className="mt-1 text-2xl font-bold sm:text-3xl text-gray-700" dir="ltr">{total}</p>
                  <p className="text-xs text-blue-600" dir="ltr">{labels.assigned}: {assigned}</p>
                  <p className={`text-xs ${unassigned >= 0 ? 'text-green-600' : 'text-red-600'}`} dir="ltr">{labels.unassigned}: {unassigned}</p>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="py-6 text-center text-gray-500">{labels.noData}</p>
        )}
      </div>

      {/* Chicken Summary */}
      <div className="card p-4 sm:p-6">
        <h2 className="mb-4 text-base font-semibold sm:text-lg">{labels.chickenSummary}</h2>
        {chickenRecords.length > 0 ? (
          <>
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <p className="text-center text-xs font-semibold text-blue-600">{labels.totalBought}</p>
                <div className="rounded-xl bg-blue-50 p-2 text-center sm:p-3">
                  <p className="text-xs text-blue-500">{labels.totalQuantity}</p>
                  <p className="text-lg font-bold text-blue-700 sm:text-xl" dir="ltr">{chickenBoughtQty}</p>
                </div>
                <div className="rounded-xl bg-blue-50 p-2 text-center sm:p-3">
                  <p className="text-xs text-blue-500">{labels.weightKg}</p>
                  <p className="text-lg font-bold text-blue-700 sm:text-xl" dir="ltr">{chickenBoughtWeight} <span className="text-sm font-normal">kg</span></p>
                </div>
                <div className="rounded-xl bg-blue-50 p-2 text-center sm:p-3">
                  <p className="text-xs text-blue-500">{labels.price}</p>
                  <p className="text-lg font-bold text-blue-700 sm:text-xl" dir="ltr">{CURRENCY.symbol} {chickenBoughtPrice}</p>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-center text-xs font-semibold text-green-600">{labels.totalSold}</p>
                <div className="rounded-xl bg-green-50 p-2 text-center sm:p-3">
                  <p className="text-xs text-green-500">{labels.totalQuantity}</p>
                  <p className="text-lg font-bold text-green-700 sm:text-xl" dir="ltr">{chickenSoldQty}</p>
                </div>
                <div className="rounded-xl bg-green-50 p-2 text-center sm:p-3">
                  <p className="text-xs text-green-500">{labels.weightKg}</p>
                  <p className="text-lg font-bold text-green-700 sm:text-xl" dir="ltr">{chickenSoldWeight} <span className="text-sm font-normal">kg</span></p>
                </div>
                <div className="rounded-xl bg-green-50 p-2 text-center sm:p-3">
                  <p className="text-xs text-green-500">{labels.price}</p>
                  <p className="text-lg font-bold text-green-700 sm:text-xl" dir="ltr">{CURRENCY.symbol} {chickenSoldPrice}</p>
                </div>
              </div>
            </div>
            <ProfitLossCard label={labels.profitLoss} value={chickenProfit} labels={labels} />
          </>
        ) : (
          <p className="py-6 text-center text-gray-500">{labels.noData}</p>
        )}
      </div>

      {/* Vegetable Summary */}
      <div className="card p-4 sm:p-6">
        <h2 className="mb-4 text-base font-semibold sm:text-lg">{labels.vegetableSummary}</h2>
        {vegetables.length > 0 ? (
          <>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-blue-50 p-3 text-center sm:p-4">
                <p className="text-xs font-medium text-blue-600">{labels.totalBuyPrice}</p>
                <p className="mt-1 text-xl font-bold text-blue-700 sm:text-2xl" dir="ltr">
                  {CURRENCY.symbol} {vegBuyPrice}
                </p>
              </div>
              <div className="rounded-xl bg-green-50 p-3 text-center sm:p-4">
                <p className="text-xs font-medium text-green-600">{labels.totalSellPrice}</p>
                <p className="mt-1 text-xl font-bold text-green-700 sm:text-2xl" dir="ltr">
                  {CURRENCY.symbol} {vegSellPrice}
                </p>
              </div>
            </div>
            <ProfitLossCard label={labels.profitLoss} value={vegProfit} labels={labels} />
          </>
        ) : (
          <p className="py-6 text-center text-gray-500">{labels.noData}</p>
        )}
      </div>
    </div>
  )
}

function ProfitLossCard({
  label,
  value,
  labels,
}: {
  label: string
  value: number
  labels: Record<string, string>
}) {
  const isProfit = value >= 0
  return (
    <div className={`rounded-xl p-3 text-center sm:p-4 ${isProfit ? 'bg-green-50' : 'bg-red-50'}`}>
      <p className={`text-xs font-medium ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
        {label} — {isProfit ? labels.profit : labels.loss}
      </p>
      <p className={`mt-1 text-xl font-bold sm:text-2xl ${isProfit ? 'text-green-700' : 'text-red-700'}`} dir="ltr">
        {CURRENCY.symbol} {Math.abs(value)}
      </p>
    </div>
  )
}
