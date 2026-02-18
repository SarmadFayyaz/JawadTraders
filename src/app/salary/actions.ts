'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

function toTitleCase(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export async function addSalary(formData: FormData) {
  const supabase = await createClient()

  const employee_name = toTitleCase(formData.get('employee_name') as string)
  const phone = (formData.get('phone') as string)?.trim() || null
  const month = formData.get('month') as string
  const total_pay = parseFloat(formData.get('total_pay') as string)
  const paid = parseFloat(formData.get('paid') as string) || 0
  const remaining = total_pay - paid

  // Check if employee exists (case-insensitive match)
  const { data: existingEmployee } = await supabase
    .from('employees')
    .select('id')
    .ilike('name', employee_name)
    .single()

  let employee_id: string

  if (existingEmployee) {
    employee_id = existingEmployee.id
    // Update phone if provided
    if (phone) {
      await supabase
        .from('employees')
        .update({ phone })
        .eq('id', employee_id)
    }
  } else {
    // Create new employee
    const { data: newEmployee, error } = await supabase
      .from('employees')
      .insert({ name: employee_name, phone })
      .select('id')
      .single()
    if (error) return { error: error.message || 'Error' }
    employee_id = newEmployee.id
  }

  // Upsert salary record (on conflict employee_id + month → update)
  const { error } = await supabase
    .from('salary_records')
    .upsert(
      { employee_id, month, total_pay, paid, remaining },
      { onConflict: 'employee_id,month' }
    )
  if (error) return { error: error.message || 'Error' }

  revalidatePath('/salary')
  return { success: true }
}

export async function updateSalary(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const total_pay = parseFloat(formData.get('total_pay') as string)
  const paid = parseFloat(formData.get('paid') as string) || 0
  const remaining = total_pay - paid
  const phone = (formData.get('phone') as string)?.trim() || null
  const employee_id = formData.get('employee_id') as string

  // Update phone on employee if provided
  if (phone && employee_id) {
    await supabase
      .from('employees')
      .update({ phone })
      .eq('id', employee_id)
  }

  const { error } = await supabase
    .from('salary_records')
    .update({ total_pay, paid, remaining })
    .eq('id', id)
  if (error) return { error: error.message || 'Error' }

  revalidatePath('/salary')
  return { success: true }
}

export async function deleteSalary(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string

  const { error } = await supabase
    .from('salary_records')
    .delete()
    .eq('id', id)
  if (error) return { error: error.message || 'Error' }

  revalidatePath('/salary')
  return { success: true }
}
