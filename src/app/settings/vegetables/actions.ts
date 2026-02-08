'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addVegetableName(_prev: { error: string | null }, formData: FormData) {
  const supabase = await createClient()
  const name = (formData.get('name') as string).trim()

  const { data: existing } = await supabase
    .from('vegetable_names')
    .select('id')
    .ilike('name', name)
    .limit(1)

  if (existing && existing.length > 0) {
    return { error: 'duplicate' }
  }

  const unit = (formData.get('unit') as string) || 'kg'

  const { error } = await supabase.from('vegetable_names').insert({ name, unit })

  if (error) throw error

  revalidatePath('/settings/vegetables')
  return { error: null }
}

export async function updateVegetableName(_prev: { error: string | null }, formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  const name = (formData.get('name') as string).trim()

  const { data: existing } = await supabase
    .from('vegetable_names')
    .select('id')
    .ilike('name', name)
    .neq('id', id)
    .limit(1)

  if (existing && existing.length > 0) {
    return { error: 'duplicate' }
  }

  const unit = (formData.get('unit') as string) || 'kg'

  const { error } = await supabase
    .from('vegetable_names')
    .update({ name, unit })
    .eq('id', id)

  if (error) throw error

  revalidatePath('/settings/vegetables')
  return { error: null }
}

export async function deleteVegetableName(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string

  const { error } = await supabase.from('vegetable_names').delete().eq('id', id)

  if (error) throw error

  revalidatePath('/settings/vegetables')
}
