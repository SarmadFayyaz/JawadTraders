import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { DailySalesPage } from '@/components/daily-sales/DailySalesPage'

export default async function DailySalesRoute({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const { date } = await searchParams
  const selectedDate = date || new Date().toISOString().split('T')[0]

  const supabase = await createClient()

  const [sheetRes, salesRes, customersRes] = await Promise.all([
    supabase
      .from('daily_sale_sheets')
      .select('*')
      .eq('date', selectedDate)
      .single(),
    supabase
      .from('daily_sales')
      .select('*, customers(name, phone)')
      .eq('date', selectedDate)
      .order('created_at', { ascending: false }),
    supabase
      .from('customers')
      .select('*')
      .order('name'),
  ])

  return (
    <DashboardShell>
      <DailySalesPage
        sheet={sheetRes.data}
        sales={(salesRes.data as any) ?? []}
        customers={(customersRes.data as any) ?? []}
        selectedDate={selectedDate}
      />
    </DashboardShell>
  )
}
