import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { DashboardView } from '@/components/dashboard/DashboardView'

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const { date } = await searchParams
  const selectedDate = date || new Date().toISOString().split('T')[0]
  const supabase = await createClient()

  const [assignmentsRes, cylinderTypesRes, vegetablesRes, chickenRes] = await Promise.all([
    supabase
      .from('cylinder_assignments')
      .select('*, cylinder_types(name)')
      .eq('date', selectedDate)
      .order('created_at', { ascending: false }),
    supabase.from('cylinder_types').select('*').order('name'),
    supabase
      .from('vegetables')
      .select('*')
      .eq('date', selectedDate)
      .order('name'),
    supabase
      .from('chicken_records')
      .select('*')
      .eq('date', selectedDate)
      .order('created_at', { ascending: false }),
  ])

  return (
    <DashboardShell>
      <DashboardView
        assignments={(assignmentsRes.data as any) ?? []}
        cylinderTypes={(cylinderTypesRes.data as any) ?? []}
        vegetables={(vegetablesRes.data as any) ?? []}
        chickenRecords={(chickenRes.data as any) ?? []}
        selectedDate={selectedDate}
      />
    </DashboardShell>
  )
}
