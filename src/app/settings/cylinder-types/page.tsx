import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { CylinderTypesPage } from '@/components/cylinders/CylinderTypesPage'

export default async function CylinderTypesSettingsPage() {
  const supabase = await createClient()

  const { data: cylinderTypes } = await supabase
    .from('cylinder_types')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <DashboardShell>
      <CylinderTypesPage cylinderTypes={(cylinderTypes as any) ?? []} />
    </DashboardShell>
  )
}
