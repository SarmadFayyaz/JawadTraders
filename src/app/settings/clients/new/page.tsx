import { DashboardShell } from '@/components/layout/DashboardShell'
import { ClientForm } from '@/components/clients/ClientForm'
import { PageTitle } from '@/components/layout/PageTitle'

export default function NewClientPage() {
  return (
    <DashboardShell>
      <PageTitle labelKey="addClient" />
      <ClientForm />
    </DashboardShell>
  )
}
