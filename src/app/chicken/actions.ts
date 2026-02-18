'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ChickenRecordType } from '@/types/database'

export async function addChickenRecord(formData: FormData) {
  const supabase = await createClient()

  const date = formData.get('date') as string
  const type = formData.get('type') as ChickenRecordType
  const quantity = parseInt(formData.get('quantity') as string)
  const weight_kg = parseFloat(formData.get('weight_kg') as string)

  if (type === 'sold') {
    const { data: records } = await supabase
      .from('chicken_records')
      .select('type, quantity, weight_kg')
      .eq('date', date)

    const bought = (records ?? []).filter((r) => r.type === 'bought')
    const sold = (records ?? []).filter((r) => r.type === 'sold')
    const remainingQty = bought.reduce((s, r) => s + r.quantity, 0) - sold.reduce((s, r) => s + r.quantity, 0)
    const remainingWeight = bought.reduce((s, r) => s + r.weight_kg, 0) - sold.reduce((s, r) => s + r.weight_kg, 0)

    if (quantity > remainingQty || weight_kg > remainingWeight) {
      return { error: 'Sold cannot exceed remaining quantity' }
    }
  }

  const price = parseFloat(formData.get('price') as string) || 0

  const { error } = await supabase.from('chicken_records').insert({
    type,
    quantity,
    weight_kg,
    price,
    date,
  })

  if (error) return { error: error.message }

  revalidatePath(`/chicken?date=${date}`)
  return { success: true }
}

export async function deleteChickenRecord(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const date = formData.get('date') as string

  const { error } = await supabase.from('chicken_records').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(`/chicken?date=${date}`)
  return { success: true }
}
