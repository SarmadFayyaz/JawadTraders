'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addVegetable(formData: FormData) {
  const supabase = await createClient()

  const date = formData.get('date') as string

  const { error } = await supabase.from('vegetables').insert({
    name: formData.get('name') as string,
    qty_bought: parseFloat(formData.get('qty_bought') as string) || 0,
    price_bought: parseFloat(formData.get('price_bought') as string) || 0,
    date,
  })

  if (error) throw new Error(error.message)

  revalidatePath(`/vegetables?date=${date}`)
}

export async function updateVegetable(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const date = formData.get('date') as string

  const { error } = await supabase.from('vegetables').update({
    qty_sold: parseFloat(formData.get('qty_sold') as string) || 0,
    price_sold: parseFloat(formData.get('price_sold') as string) || 0,
  }).eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath(`/vegetables?date=${date}`)
}

export async function deleteVegetable(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const date = formData.get('date') as string

  const { error } = await supabase.from('vegetables').delete().eq('id', id)

  if (error) throw error

  revalidatePath(`/vegetables?date=${date}`)
}
