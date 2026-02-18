'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Legacy component — add/edit is now handled via modals in ClientList
export function ClientForm() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/settings/clients')
  }, [router])
  return null
}
