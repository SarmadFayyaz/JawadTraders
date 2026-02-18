'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function assignCylinder(formData: FormData) {
  const supabase = await createClient()
  const clientId = formData.get('client_id') as string
  const cylinderTypeId = formData.get('cylinder_type_id') as string
  const quantity = parseInt(formData.get('quantity') as string, 10)
  const date = formData.get('date') as string

  // Check availability
  const { data: cylinderType } = await supabase
    .from('cylinder_types')
    .select('no_of_cylinders')
    .eq('id', cylinderTypeId)
    .single()

  if (!cylinderType || cylinderType.no_of_cylinders < quantity) {
    return { error: 'not_enough' }
  }

  // Check if an assignment already exists for same client + type + date
  const { data: existing } = await supabase
    .from('cylinder_assignments')
    .select('id, quantity')
    .eq('client_id', clientId)
    .eq('cylinder_type_id', cylinderTypeId)
    .eq('date', date)
    .single()

  if (existing) {
    // Update existing record by adding the new quantity
    const { error: updateError } = await supabase
      .from('cylinder_assignments')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id)

    if (updateError) return { error: updateError.message }
  } else {
    // Insert new assignment
    const { error: insertError } = await supabase.from('cylinder_assignments').insert({
      client_id: clientId,
      cylinder_type_id: cylinderTypeId,
      quantity,
      date,
    })

    if (insertError) return { error: insertError.message }
  }

  // Deduct from inventory
  const { error: updateError } = await supabase
    .from('cylinder_types')
    .update({ no_of_cylinders: cylinderType.no_of_cylinders - quantity })
    .eq('id', cylinderTypeId)

  if (updateError) return { error: updateError.message }

  revalidatePath('/cylinders')
  revalidatePath('/settings/cylinder-types')
  return { success: true }
}

export async function updateAssignment(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  const newQuantity = parseInt(formData.get('quantity') as string, 10)

  // Fetch current assignment
  const { data: assignment } = await supabase
    .from('cylinder_assignments')
    .select('quantity, cylinder_type_id')
    .eq('id', id)
    .single()

  if (!assignment) return { error: 'not_enough' }

  const diff = newQuantity - assignment.quantity

  if (diff !== 0) {
    // Check availability if increasing
    const { data: cylinderType } = await supabase
      .from('cylinder_types')
      .select('no_of_cylinders')
      .eq('id', assignment.cylinder_type_id)
      .single()

    if (!cylinderType || (diff > 0 && cylinderType.no_of_cylinders < diff)) {
      return { error: 'not_enough' }
    }

    // Update assignment quantity
    const { error: updateError } = await supabase
      .from('cylinder_assignments')
      .update({ quantity: newQuantity })
      .eq('id', id)

    if (updateError) return { error: updateError.message }

    // Adjust inventory (subtract diff: positive diff means more assigned, negative means returned)
    const { error: invError } = await supabase
      .from('cylinder_types')
      .update({ no_of_cylinders: cylinderType.no_of_cylinders - diff })
      .eq('id', assignment.cylinder_type_id)

    if (invError) return { error: invError.message }
  }

  revalidatePath('/cylinders')
  revalidatePath('/settings/cylinder-types')
  return { success: true }
}

export async function deleteAssignment(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  // Fetch the assignment to know quantity and type
  const { data: assignment } = await supabase
    .from('cylinder_assignments')
    .select('quantity, cylinder_type_id')
    .eq('id', id)
    .single()

  if (!assignment) return { error: 'Assignment not found' }

  // Delete the assignment
  const { error: deleteError } = await supabase
    .from('cylinder_assignments')
    .delete()
    .eq('id', id)

  if (deleteError) return { error: deleteError.message }

  // Return cylinders to inventory
  const { data: cylinderType } = await supabase
    .from('cylinder_types')
    .select('no_of_cylinders')
    .eq('id', assignment.cylinder_type_id)
    .single()

  if (cylinderType) {
    const { error: updateError } = await supabase
      .from('cylinder_types')
      .update({ no_of_cylinders: cylinderType.no_of_cylinders + assignment.quantity })
      .eq('id', assignment.cylinder_type_id)

    if (updateError) return { error: updateError.message }
  }

  revalidatePath('/cylinders')
  revalidatePath('/settings/cylinder-types')
  return { success: true }
}
