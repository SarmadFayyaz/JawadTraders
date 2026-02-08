import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { ClientList } from '@/components/clients/ClientList'
import { PageTitle } from '@/components/layout/PageTitle'
import { AddClientButton } from '@/components/clients/AddClientButton'

export default async function ClientsPage() {
  const supabase = await createClient()

  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .order('name')

  return (
    <DashboardShell>
      <div className="mb-4 flex items-center justify-between">
        <PageTitle labelKey="clients" />
        <AddClientButton />
      </div>
      <ClientList clients={(clients as any) ?? []} />
    </DashboardShell>
  )
}
