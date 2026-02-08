'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/language-context'
import { formatDate } from '@/lib/utils'
import { VEGETABLE_UNITS, CURRENCY } from '@/lib/constants'
import type { Vegetable, ChickenRecord, VegetableName } from '@/types/database'

interface ClientItemWithName {
  id: string
  client_id: string
  item_name: string
  quantity: number
  date: string
  clients: { name: string }
}

type ReportTab = 'sales' | 'stock' | 'client'

export function ReportsView({
  vegetables,
  chickenRecords,
  clientItems,
  vegetableNames,
  selectedDate,
}: {
  vegetables: Vegetable[]
  chickenRecords: ChickenRecord[]
  clientItems: ClientItemWithName[]
  vegetableNames: VegetableName[]
  selectedDate: string
}) {
  const { labels, dateLocale } = useLanguage()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ReportTab>('sales')

  function handleDateChange(newDate: string) {
    router.push(`/reports?date=${newDate}`)
  }

  const tabs: { key: ReportTab; label: string }[] = [
    { key: 'sales', label: labels.dailySalesReport },
    { key: 'stock', label: labels.remainingStockReport },
    { key: 'client', label: labels.clientWiseReport },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{labels.reports}</h1>
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

      {/* Tabs */}
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report content */}
      {activeTab === 'sales' && (
        <DailySalesReport
          vegetables={vegetables}
          chickenRecords={chickenRecords}
          vegetableNames={vegetableNames}
          labels={labels}
        />
      )}
      {activeTab === 'stock' && (
        <RemainingStockReport
          vegetables={vegetables}
          chickenRecords={chickenRecords}
          vegetableNames={vegetableNames}
          labels={labels}
        />
      )}
      {activeTab === 'client' && (
        <ClientWiseReport clientItems={clientItems} labels={labels} />
      )}
    </div>
  )
}

/* ===================== Daily Sales Report ===================== */

function getUnitDisplay(vegName: string, vegetableNames: VegetableName[], labels: Record<string, string>) {
  const vn = vegetableNames.find((v) => v.name === vegName)
  const unitObj = VEGETABLE_UNITS.find((u) => u.value === vn?.unit)
  return unitObj ? labels[unitObj.labelKey] : vn?.unit ?? ''
}

function DailySalesReport({
  vegetables,
  chickenRecords,
  vegetableNames,
  labels,
}: {
  vegetables: Vegetable[]
  chickenRecords: ChickenRecord[]
  vegetableNames: VegetableName[]
  labels: Record<string, string>
}) {
  const vegSold = vegetables.filter((v) => v.qty_sold > 0)
  const chickenSold = chickenRecords.filter((r) => r.type === 'sold')

  const totalChickenSoldQty = chickenSold.reduce((sum, r) => sum + r.quantity, 0)
  const totalChickenSoldWeight = chickenSold.reduce((sum, r) => sum + r.weight_kg, 0)

  return (
    <div className="space-y-6">
      {/* Vegetables Sold */}
      <div className="card overflow-x-auto">
        <h2 className="mb-3 text-lg font-semibold">{labels.vegetablesSold}</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="pb-2 pe-4 text-start font-medium">{labels.vegetableName}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.sold}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.unit}</th>
              <th className="pb-2 text-start font-medium">{labels.priceSold}</th>
            </tr>
          </thead>
          <tbody>
            {vegSold.map((v) => (
              <tr key={v.id} className="border-b border-gray-100">
                <td className="py-3 pe-4 font-medium">{v.name}</td>
                <td className="py-3 pe-4" dir="ltr">{v.qty_sold}</td>
                <td className="py-3 pe-4 text-gray-500">{getUnitDisplay(v.name, vegetableNames, labels)}</td>
                <td className="py-3" dir="ltr">{v.price_sold > 0 ? `${CURRENCY.symbol} ${v.price_sold}` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {vegSold.length === 0 && (
          <p className="py-6 text-center text-gray-500">{labels.noData}</p>
        )}
      </div>

      {/* Chicken Sold */}
      <div className="card overflow-x-auto">
        <h2 className="mb-3 text-lg font-semibold">{labels.chickenSoldReport}</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="pb-2 pe-4 text-start font-medium">{labels.numberOfChickens}</th>
              <th className="pb-2 text-start font-medium">{labels.weightKg}</th>
            </tr>
          </thead>
          <tbody>
            {chickenSold.map((r) => (
              <tr key={r.id} className="border-b border-gray-100">
                <td className="py-3 pe-4" dir="ltr">{r.quantity}</td>
                <td className="py-3" dir="ltr">{r.weight_kg} kg</td>
              </tr>
            ))}
          </tbody>
          {chickenSold.length > 0 && (
            <tfoot>
              <tr className="border-t-2 border-gray-300 font-semibold">
                <td className="pt-3 pe-4 text-orange-600" dir="ltr">{totalChickenSoldQty}</td>
                <td className="pt-3 text-orange-600" dir="ltr">{totalChickenSoldWeight} kg</td>
              </tr>
            </tfoot>
          )}
        </table>
        {chickenSold.length === 0 && (
          <p className="py-6 text-center text-gray-500">{labels.noData}</p>
        )}
      </div>
    </div>
  )
}

/* ===================== Remaining Stock Report ===================== */

function RemainingStockReport({
  vegetables,
  chickenRecords,
  vegetableNames,
  labels,
}: {
  vegetables: Vegetable[]
  chickenRecords: ChickenRecord[]
  vegetableNames: VegetableName[]
  labels: Record<string, string>
}) {
  const chickenBought = chickenRecords.filter((r) => r.type === 'bought')
  const chickenSold = chickenRecords.filter((r) => r.type === 'sold')
  const totalChickenBoughtQty = chickenBought.reduce((sum, r) => sum + r.quantity, 0)
  const totalChickenSoldQty = chickenSold.reduce((sum, r) => sum + r.quantity, 0)
  const totalChickenBoughtWeight = chickenBought.reduce((sum, r) => sum + r.weight_kg, 0)
  const totalChickenSoldWeight = chickenSold.reduce((sum, r) => sum + r.weight_kg, 0)
  const remainingChickenQty = totalChickenBoughtQty - totalChickenSoldQty
  const remainingChickenWeight = totalChickenBoughtWeight - totalChickenSoldWeight

  return (
    <div className="space-y-6">
      {/* Vegetable Stock */}
      <div className="card overflow-x-auto">
        <h2 className="mb-3 text-lg font-semibold">{labels.vegetableInventory}</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="pb-2 pe-4 text-start font-medium">{labels.vegetableName}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.bought}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.priceBought}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.sold}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.priceSold}</th>
              <th className="pb-2 pe-4 text-start font-medium">{labels.remaining}</th>
              <th className="pb-2 text-start font-medium">{labels.unit}</th>
            </tr>
          </thead>
          <tbody>
            {vegetables.map((v) => {
              const rem = v.qty_bought - v.qty_sold
              return (
                <tr key={v.id} className="border-b border-gray-100">
                  <td className="py-3 pe-4 font-medium">{v.name}</td>
                  <td className="py-3 pe-4" dir="ltr">{v.qty_bought}</td>
                  <td className="py-3 pe-4" dir="ltr">{v.price_bought > 0 ? `${CURRENCY.symbol} ${v.price_bought}` : '-'}</td>
                  <td className="py-3 pe-4" dir="ltr">{v.qty_sold}</td>
                  <td className="py-3 pe-4" dir="ltr">{v.price_sold > 0 ? `${CURRENCY.symbol} ${v.price_sold}` : '-'}</td>
                  <td className={`py-3 pe-4 font-medium ${rem >= 0 ? 'text-green-600' : 'text-red-600'}`} dir="ltr">
                    {rem}
                  </td>
                  <td className="py-3 text-gray-500">{getUnitDisplay(v.name, vegetableNames, labels)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {vegetables.length === 0 && (
          <p className="py-6 text-center text-gray-500">{labels.noData}</p>
        )}
      </div>

      {/* Chicken Stock */}
      <div className="card">
        <h2 className="mb-3 text-lg font-semibold">{labels.chickenManagement}</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-blue-50 p-4">
            <p className="text-xs font-medium text-blue-600">{labels.totalBought}</p>
            <p className="mt-1 text-xl font-bold text-blue-700" dir="ltr">{totalChickenBoughtQty}</p>
            <p className="text-sm text-blue-600" dir="ltr">{totalChickenBoughtWeight} kg</p>
          </div>
          <div className="rounded-xl bg-orange-50 p-4">
            <p className="text-xs font-medium text-orange-600">{labels.totalSold}</p>
            <p className="mt-1 text-xl font-bold text-orange-700" dir="ltr">{totalChickenSoldQty}</p>
            <p className="text-sm text-orange-600" dir="ltr">{totalChickenSoldWeight} kg</p>
          </div>
          <div className={`rounded-xl p-4 ${remainingChickenQty >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className={`text-xs font-medium ${remainingChickenQty >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {labels.remaining}
            </p>
            <p className={`mt-1 text-xl font-bold ${remainingChickenQty >= 0 ? 'text-green-700' : 'text-red-700'}`} dir="ltr">
              {remainingChickenQty}
            </p>
            <p className={`text-sm ${remainingChickenWeight >= 0 ? 'text-green-600' : 'text-red-600'}`} dir="ltr">
              {remainingChickenWeight} kg
            </p>
          </div>
        </div>
        {chickenRecords.length === 0 && (
          <p className="py-6 text-center text-gray-500">{labels.noData}</p>
        )}
      </div>
    </div>
  )
}

/* ===================== Client-wise Item Report ===================== */

function ClientWiseReport({
  clientItems,
  labels,
}: {
  clientItems: ClientItemWithName[]
  labels: Record<string, string>
}) {
  // Group by client name
  const byClient = new Map<string, { items: { name: string; quantity: number }[]; totalQty: number }>()

  for (const item of clientItems) {
    const clientName = item.clients.name
    const existing = byClient.get(clientName)
    if (existing) {
      existing.items.push({ name: item.item_name, quantity: item.quantity })
      existing.totalQty += item.quantity
    } else {
      byClient.set(clientName, {
        items: [{ name: item.item_name, quantity: item.quantity }],
        totalQty: item.quantity,
      })
    }
  }

  return (
    <div className="space-y-4">
      {[...byClient.entries()].map(([clientName, data]) => (
        <div key={clientName} className="card overflow-x-auto">
          <h2 className="mb-3 text-lg font-semibold">{clientName}</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="pb-2 pe-4 text-start font-medium">{labels.itemName}</th>
                <th className="pb-2 text-start font-medium">{labels.quantity}</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 pe-4 font-medium">{item.name}</td>
                  <td className="py-3" dir="ltr">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-300 font-semibold">
                <td className="pt-3 pe-4">{labels.total}</td>
                <td className="pt-3 text-primary-600" dir="ltr">{data.totalQty}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      ))}

      {byClient.size === 0 && (
        <div className="card">
          <p className="py-6 text-center text-gray-500">{labels.noData}</p>
        </div>
      )}
    </div>
  )
}
