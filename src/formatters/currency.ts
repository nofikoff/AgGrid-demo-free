export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return '\u2014'
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
