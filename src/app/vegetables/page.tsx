import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { VegetableInventory } from '@/components/vegetables/VegetableInventory'

export default async function VegetablesPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const { date } = await searchParams
  const selectedDate = date || new Date().toISOString().split('T')[0]

  const supabase = await createClient()

  const [{ data: vegetables }, { data: vegetableNames }] = await Promise.all([
    supabase
      .from('vegetables')
      .select('*')
      .eq('date', selectedDate)
      .order('created_at', { ascending: false }),
    supabase
      .from('vegetable_names')
      .select('*')
      .order('name', { ascending: true }),
  ])

  return (
    <DashboardShell>
      <VegetableInventory
        vegetables={(vegetables as any) ?? []}
        vegetableNames={(vegetableNames as any) ?? []}
        selectedDate={selectedDate}
      />
    </DashboardShell>
  )
}
