'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addCylinderType(_prev: { error: string | null }, formData: FormData) {
  const supabase = await createClient()
  const name = (formData.get('name') as string).trim()

  const { data: existing } = await supabase
    .from('cylinder_types')
    .select('id')
    .ilike('name', name)
    .limit(1)

  if (existing && existing.length > 0) {
    return { error: 'duplicate' }
  }

  const { error } = await supabase.from('cylinder_types').insert({
    name,
    weight_kg: parseFloat(formData.get('weight_kg') as string),
    cylinder_price: parseFloat(formData.get('cylinder_price') as string),
    gas_price: parseFloat(formData.get('gas_price') as string),
    no_of_cylinders: parseInt(formData.get('no_of_cylinders') as string, 10),
  })

  if (error) throw error

  revalidatePath('/settings/cylinder-types')
  return { error: null }
}

export async function updateCylinderType(_prev: { error: string | null }, formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  const name = (formData.get('name') as string).trim()

  const { data: existing } = await supabase
    .from('cylinder_types')
    .select('id')
    .ilike('name', name)
    .neq('id', id)
    .limit(1)

  if (existing && existing.length > 0) {
    return { error: 'duplicate' }
  }

  const { error } = await supabase
    .from('cylinder_types')
    .update({
      name,
      weight_kg: parseFloat(formData.get('weight_kg') as string),
      cylinder_price: parseFloat(formData.get('cylinder_price') as string),
      gas_price: parseFloat(formData.get('gas_price') as string),
      no_of_cylinders: parseInt(formData.get('no_of_cylinders') as string, 10),
    })
    .eq('id', id)

  if (error) throw error

  revalidatePath('/settings/cylinder-types')
  return { error: null }
}

export async function deleteCylinderType(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string

  const { error } = await supabase.from('cylinder_types').delete().eq('id', id)

  if (error) throw error

  revalidatePath('/settings/cylinder-types')
}
