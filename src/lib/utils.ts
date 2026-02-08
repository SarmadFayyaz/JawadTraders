import { CURRENCY } from './constants'

export function formatCurrency(amount: number, dateLocale: string = 'ur-PK'): string {
  return new Intl.NumberFormat(dateLocale, {
    style: 'currency',
    currency: CURRENCY.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateString: string, dateLocale: string = 'ur-PK'): string {
  return new Intl.DateTimeFormat(dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString))
}

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
