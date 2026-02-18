export interface CampaignRow {
  id: number
  campaignName: string
  advertiser: string
  country: string
  countryCode: string
  appName: string
  category: string
  month: string
  impressions: number
  clicks: number
  ctr: number
  installs: number
  cpi: number
  revenue: number
  spend: number
  profit: number
  roi: number
  dau: number
}

export interface CountryRow {
  id: number
  country: string
  countryCode: string
  flagEmoji: string
  clicks: number
  installs: number
  revenue: number
  spend: number
  profit: number
  dau: number
  revenueHistory: number[]
}

export interface AppRow {
  id: number
  appName: string
  bundleId: string
  category: string
  installs: number
  revenue: number
  dau: number
  retentionD1: number
  retentionD7: number
  selected: boolean
}

export interface SourceBreakdown {
  source: string
  revenue: number
  spend: number
  profit: number
  installs: number
}

export interface DailyRevenueRow {
  id: number
  date: string
  totalRevenue: number
  totalSpend: number
  profit: number
  transactions: number
  sources: SourceBreakdown[]
  _expanded?: boolean
  _isDetail?: boolean
  _parentId?: number
}

export interface DragCampaignRow {
  id: number
  priority: number
  campaignName: string
  status: 'active' | 'paused' | 'draft'
  dailyBudget: number
  spend: number
  installs: number
  cpi: number
}
