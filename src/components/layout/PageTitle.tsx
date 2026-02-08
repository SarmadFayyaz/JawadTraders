'use client'

import { useLanguage } from '@/lib/language-context'
import type { LabelKey } from '@/lib/constants'

export function PageTitle({ labelKey }: { labelKey: LabelKey }) {
  const { labels } = useLanguage()
  return <h1 className="mb-4 text-xl font-bold sm:text-2xl">{labels[labelKey]}</h1>
}
