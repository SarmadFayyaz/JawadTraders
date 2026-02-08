'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addItem(formData: FormData) {
  const supabase = await createClient()

  const clientId = formData.get('client_id') as string

  const { error } = await supabase.from('client_items').insert({
    client_id: clientId,
    item_name: formData.get('item_name') as string,
    quantity: parseFloat(formData.get('quantity') as string),
    date: formData.get('date') as string,
  })

  if (error) throw error

  revalidatePath(`/settings/clients/${clientId}/items`)
}

export async function deleteItem(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const clientId = formData.get('client_id') as string

  const { error } = await supabase.from('client_items').delete().eq('id', id)

  if (error) throw error

  revalidatePath(`/settings/clients/${clientId}/items`)
}
