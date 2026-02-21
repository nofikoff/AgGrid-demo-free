export interface ProfitResult {
  text: string
  color: string
}

export function formatProfit(value: number | null | undefined): ProfitResult {
  if (value == null) return { text: '\u2014', color: '' }
  const formatted = `$${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  if (value > 0) return { text: `\u25B2 +${formatted}`, color: '#16a34a' }
  if (value < 0) return { text: `\u25BC -${formatted}`, color: '#dc2626' }
  return { text: formatted, color: '#6b7280' }
}
