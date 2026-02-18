'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { SaleType } from '@/types/database'

function toTitleCase(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export async function saveDayOpening(formData: FormData) {
  const supabase = await createClient()

  const date = formData.get('date') as string
  const total_cylinders = parseInt(formData.get('total_cylinders') as string)
  const total_gas_kg = parseFloat(formData.get('total_gas_kg') as string)

  // Check if entry already exists for this date
  const { data: existing } = await supabase
    .from('daily_sale_sheets')
    .select('id')
    .eq('date', date)
    .single()

  if (existing) {
    const { error } = await supabase
      .from('daily_sale_sheets')
      .update({ total_cylinders, total_gas_kg })
      .eq('id', existing.id)
    if (error) return { error: error.message || 'Error' }
  } else {
    const { error } = await supabase
      .from('daily_sale_sheets')
      .insert({ date, total_cylinders, total_gas_kg })
    if (error) return { error: error.message || 'Error' }
  }

  revalidatePath('/daily-sales')
  return { success: true }
}

export async function addDailySale(formData: FormData) {
  const supabase = await createClient()

  const date = formData.get('date') as string
  const customer_name = toTitleCase(formData.get('customer_name') as string)
  const phone = (formData.get('phone') as string)?.trim() || null
  const sale_type = (formData.get('sale_type') as SaleType) || 'other'
  const gas_kg = sale_type === 'gas' ? parseFloat(formData.get('gas_kg') as string) || null : null
  const total_amount = parseFloat(formData.get('total_amount') as string)
  const paid = parseFloat(formData.get('paid') as string) || 0
  const remaining = total_amount - paid

  // Check if customer exists (case-insensitive match)
  const { data: existingCustomer } = await supabase
    .from('customers')
    .select('id, balance')
    .ilike('name', customer_name)
    .single()

  let customer_id: string

  if (existingCustomer) {
    // Update existing customer balance and phone
    customer_id = existingCustomer.id
    const newBalance = existingCustomer.balance + remaining
    const updateData: { balance: number; phone?: string } = { balance: newBalance }
    if (phone) updateData.phone = phone

    const { error } = await supabase
      .from('customers')
      .update(updateData)
      .eq('id', customer_id)
    if (error) return { error: error.message || 'Error' }
  } else {
    // Create new customer with Title Case name
    const { data: newCustomer, error } = await supabase
      .from('customers')
      .insert({ name: customer_name, phone, balance: remaining })
      .select('id')
      .single()
    if (error) return { error: error.message || 'Error' }
    customer_id = newCustomer.id
  }

  // Insert the sale record
  const { error } = await supabase.from('daily_sales').insert({
    date,
    customer_id,
    sale_type,
    gas_kg,
    total_amount,
    paid,
    remaining,
  })
  if (error) return { error: error.message || 'Error' }

  revalidatePath('/daily-sales')
  return { success: true }
}

export async function deleteDailySale(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const date = formData.get('date') as string

  // Get the sale to know how much to subtract from customer balance
  const { data: sale } = await supabase
    .from('daily_sales')
    .select('customer_id, remaining')
    .eq('id', id)
    .single()

  if (sale) {
    // Subtract remaining from customer balance
    const { data: customer } = await supabase
      .from('customers')
      .select('balance')
      .eq('id', sale.customer_id)
      .single()

    if (customer) {
      const newBalance = customer.balance - sale.remaining
      await supabase
        .from('customers')
        .update({ balance: newBalance })
        .eq('id', sale.customer_id)
    }
  }

  const { error } = await supabase.from('daily_sales').delete().eq('id', id)
  if (error) return { error: error.message || 'Error' }

  revalidatePath(`/daily-sales?date=${date}`)
  return { success: true }
}
