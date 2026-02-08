import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { ChickenManagement } from '@/components/chicken/ChickenManagement'

export default async function ChickenPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const { date } = await searchParams
  const selectedDate = date || new Date().toISOString().split('T')[0]

  const supabase = await createClient()

  const { data: records } = await supabase
    .from('chicken_records')
    .select('*')
    .eq('date', selectedDate)
    .order('created_at', { ascending: false })

  return (
    <DashboardShell>
      <ChickenManagement
        records={(records as any) ?? []}
        selectedDate={selectedDate}
      />
    </DashboardShell>
  )
}
