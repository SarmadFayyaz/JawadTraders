import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { ClientForm } from '@/components/clients/ClientForm'
import { PageTitle } from '@/components/layout/PageTitle'

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (!client) notFound()

  return (
    <DashboardShell>
      <PageTitle labelKey="editClient" />
      <ClientForm client={client as any} />
    </DashboardShell>
  )
}
