'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

function toTitleCase(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export async function addSupplier(formData: FormData) {
  const supabase = await createClient()

  const name = toTitleCase(formData.get('name') as string)
  const phone = (formData.get('phone') as string)?.trim() || null
  const total_bill = parseFloat(formData.get('total_bill') as string) || 0
  const paid = parseFloat(formData.get('paid') as string) || 0
  const remaining = total_bill - paid

  // Check if supplier exists (case-insensitive match)
  const { data: existing } = await supabase
    .from('suppliers')
    .select('id')
    .ilike('name', name)
    .single()

  if (existing) {
    // Update existing supplier
    const { error } = await supabase
      .from('suppliers')
      .update({ phone, total_bill, paid, remaining })
      .eq('id', existing.id)
    if (error) return { error: error.message || 'Error' }
  } else {
    // Create new supplier
    const { error } = await supabase
      .from('suppliers')
      .insert({ name, phone, total_bill, paid, remaining })
    if (error) return { error: error.message || 'Error' }
  }

  revalidatePath('/suppliers')
  return { success: true }
}

export async function updateSupplier(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const phone = (formData.get('phone') as string)?.trim() || null
  const total_bill = parseFloat(formData.get('total_bill') as string) || 0
  const paid = parseFloat(formData.get('paid') as string) || 0
  const remaining = total_bill - paid

  const { error } = await supabase
    .from('suppliers')
    .update({ phone, total_bill, paid, remaining })
    .eq('id', id)
  if (error) return { error: error.message || 'Error' }

  revalidatePath('/suppliers')
  return { success: true }
}

export async function deleteSupplier(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string

  const { error } = await supabase
    .from('suppliers')
    .delete()
    .eq('id', id)
  if (error) return { error: error.message || 'Error' }

  revalidatePath('/suppliers')
  return { success: true }
}
