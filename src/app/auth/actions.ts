'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) {
    redirect('/login?error=invalid')
  }

  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const admin = createAdminClient()
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Create user with email auto-confirmed via admin API
  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (createError) {
    redirect('/signup?error=failed')
  }

  // Sign in the newly created user
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError) {
    redirect('/login?error=invalid')
  }

  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
