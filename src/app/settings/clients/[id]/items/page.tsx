import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { ClientItemsPage } from '@/components/clients/ClientItemsPage'

export default async function ItemsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (!client) notFound()

  const { data: items } = await supabase
    .from('client_items')
    .select('*')
    .eq('client_id', id)
    .order('date', { ascending: false })

  return (
    <DashboardShell>
      <h1 className="mb-4 text-xl font-bold sm:text-2xl">{(client as any).name}</h1>
      <ClientItemsPage client={client as any} items={(items as any) ?? []} />
    </DashboardShell>
  )
}
