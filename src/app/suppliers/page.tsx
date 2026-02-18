import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { SuppliersPage } from '@/components/suppliers/SuppliersPage'

export default async function SuppliersRoute() {
  const supabase = await createClient()

  const { data: suppliers } = await supabase
    .from('suppliers')
    .select('*')
    .order('name')

  return (
    <DashboardShell>
      <SuppliersPage suppliers={(suppliers as any) ?? []} />
    </DashboardShell>
  )
}
