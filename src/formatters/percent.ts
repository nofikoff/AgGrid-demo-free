export interface PercentResult {
  text: string
  color: string
}

export function formatPercent(value: number | null | undefined): PercentResult {
  if (value == null) return { text: '\u2014', color: '' }
  const pct = (value * 100).toFixed(2)
  let color = ''
  if (value > 0) color = '#16a34a'
  else if (value < 0) color = '#dc2626'
  return { text: `${pct}%`, color }
}
