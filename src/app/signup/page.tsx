import { SignupForm } from '@/components/auth/SignupForm'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  return <SignupForm error={error} />
}
