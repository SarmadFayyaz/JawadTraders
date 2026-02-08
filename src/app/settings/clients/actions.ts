'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function addClient(_prev: { error: string | null }, formData: FormData) {
  const supabase = await createClient()
  const name = (formData.get('name') as string).trim()

  const { data: existing } = await supabase
    .from('clients')
    .select('id')
    .ilike('name', name)
    .limit(1)

  if (existing && existing.length > 0) {
    return { error: 'duplicate' }
  }

  const { error } = await supabase.from('clients').insert({
    name,
    phone: (formData.get('phone') as string) || null,
  })

  if (error) throw error

  revalidatePath('/settings/clients')
  redirect('/settings/clients')
}

export async function updateClient(_prev: { error: string | null }, formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  const name = (formData.get('name') as string).trim()

  const { data: existing } = await supabase
    .from('clients')
    .select('id')
    .ilike('name', name)
    .neq('id', id)
    .limit(1)

  if (existing && existing.length > 0) {
    return { error: 'duplicate' }
  }

  const { error } = await supabase
    .from('clients')
    .update({
      name,
      phone: (formData.get('phone') as string) || null,
    })
    .eq('id', id)

  if (error) throw error

  revalidatePath('/settings/clients')
  redirect('/settings/clients')
}

export async function deleteClient(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string

  const { error } = await supabase.from('clients').delete().eq('id', id)

  if (error) throw error

  revalidatePath('/settings/clients')
}
