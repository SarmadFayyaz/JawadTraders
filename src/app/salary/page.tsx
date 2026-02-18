import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { SalaryPage } from '@/components/salary/SalaryPage'

export default async function SalaryRoute({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>
}) {
  const { month } = await searchParams
  const selectedMonth = month || new Date().toISOString().slice(0, 7)

  const supabase = await createClient()

  const [salaryRes, employeesRes] = await Promise.all([
    supabase
      .from('salary_records')
      .select('*, employees(name, phone)')
      .eq('month', selectedMonth)
      .order('created_at', { ascending: false }),
    supabase
      .from('employees')
      .select('*')
      .order('name'),
  ])

  return (
    <DashboardShell>
      <SalaryPage
        records={(salaryRes.data as any) ?? []}
        employees={(employeesRes.data as any) ?? []}
        selectedMonth={selectedMonth}
      />
    </DashboardShell>
  )
}
