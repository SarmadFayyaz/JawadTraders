import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { CylinderAssignmentsPage } from '@/components/cylinders/CylinderAssignmentsPage'

export default async function CylindersPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const { date } = await searchParams
  const selectedDate = date || new Date().toISOString().split('T')[0]
  const supabase = await createClient()

  const [
    { data: clients },
    { data: cylinderTypes },
    { data: assignments },
  ] = await Promise.all([
    supabase.from('clients').select('id, name').order('name'),
    supabase.from('cylinder_types').select('*').order('name'),
    supabase
      .from('cylinder_assignments')
      .select('*, clients(name), cylinder_types(name)')
      .eq('date', selectedDate)
      .order('created_at', { ascending: false }),
  ])

  return (
    <DashboardShell>
      <CylinderAssignmentsPage
        clients={(clients as any) ?? []}
        cylinderTypes={(cylinderTypes as any) ?? []}
        assignments={(assignments as any) ?? []}
        selectedDate={selectedDate}
      />
    </DashboardShell>
  )
}
