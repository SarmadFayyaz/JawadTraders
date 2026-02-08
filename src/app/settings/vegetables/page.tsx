import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { VegetableNamesPage } from '@/components/settings/VegetableNamesPage'

export default async function SettingsVegetablesPage() {
  const supabase = await createClient()

  const { data: vegetableNames } = await supabase
    .from('vegetable_names')
    .select('*')
    .order('name', { ascending: true })

  return (
    <DashboardShell>
      <VegetableNamesPage vegetableNames={(vegetableNames as any) ?? []} />
    </DashboardShell>
  )
}
