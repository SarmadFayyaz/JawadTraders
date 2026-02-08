import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { ReportsView } from '@/components/reports/ReportsView'

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const { date } = await searchParams
  const selectedDate = date || new Date().toISOString().split('T')[0]

  const supabase = await createClient()

  // Fetch all data in parallel
  const [vegetablesRes, chickenRes, clientItemsRes, vegetableNamesRes] = await Promise.all([
    supabase
      .from('vegetables')
      .select('*')
      .eq('date', selectedDate)
      .order('name'),
    supabase
      .from('chicken_records')
      .select('*')
      .eq('date', selectedDate)
      .order('created_at'),
    supabase
      .from('client_items')
      .select('*, clients(name)')
      .eq('date', selectedDate)
      .order('created_at'),
    supabase
      .from('vegetable_names')
      .select('*')
      .order('name'),
  ])

  return (
    <DashboardShell>
      <ReportsView
        vegetables={(vegetablesRes.data as any) ?? []}
        chickenRecords={(chickenRes.data as any) ?? []}
        clientItems={(clientItemsRes.data as any) ?? []}
        vegetableNames={(vegetableNamesRes.data as any) ?? []}
        selectedDate={selectedDate}
      />
    </DashboardShell>
  )
}
