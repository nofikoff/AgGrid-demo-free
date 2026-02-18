import { faker } from '@faker-js/faker'
import type {
  CampaignRow,
  CountryRow,
  AppRow,
  DailyRevenueRow,
  SourceBreakdown,
  DragCampaignRow,
} from '../types/adtech'
import {
  COUNTRIES,
  APPS,
  ADVERTISERS,
  CAMPAIGN_PREFIXES,
  TRAFFIC_SOURCES,
  MONTHS_2025,
} from './constants'

faker.seed(42)

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randFloat(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

export function generateCampaignData(count: number): CampaignRow[] {
  const data: CampaignRow[] = new Array(count)
  for (let i = 0; i < count; i++) {
    const country = pick(COUNTRIES)
    const app = pick(APPS)
    const impressions = randInt(5000, 5_000_000)
    const ctrRate = randFloat(0.01, 0.12)
    const clicks = Math.floor(impressions * ctrRate)
    const convRate = randFloat(0.03, 0.35)
    const installs = Math.max(1, Math.floor(clicks * convRate))
    const cpi = randFloat(0.2, 8.0)
    const spend = parseFloat((installs * cpi).toFixed(2))
    const revenueMultiplier = randFloat(0.4, 3.5)
    const revenue = parseFloat((spend * revenueMultiplier).toFixed(2))
    const profit = parseFloat((revenue - spend).toFixed(2))

    data[i] = {
      id: i,
      campaignName: `${pick(CAMPAIGN_PREFIXES)}_${country.code}_${app.name.replace(/\s/g, '')}_${i}`,
      advertiser: pick(ADVERTISERS),
      country: country.name,
      countryCode: country.code,
      appName: app.name,
      category: app.category,
      month: pick(MONTHS_2025),
      impressions,
      clicks,
      ctr: parseFloat(ctrRate.toFixed(4)),
      installs,
      cpi: parseFloat(cpi.toFixed(2)),
      revenue,
      spend,
      profit,
      roi: spend > 0 ? parseFloat((profit / spend).toFixed(4)) : 0,
      dau: randInt(100, 500_000),
    }
  }
  return data
}

export function generateCountryData(): CountryRow[] {
  return COUNTRIES.map((c, i) => {
    const clicks = randInt(50_000, 10_000_000)
    const installs = Math.floor(clicks * randFloat(0.05, 0.3))
    const spend = parseFloat((installs * randFloat(0.5, 5.0)).toFixed(2))
    const revenue = parseFloat((spend * randFloat(0.6, 3.0)).toFixed(2))

    const history: number[] = []
    let base = randFloat(1000, 50000)
    for (let d = 0; d < 30; d++) {
      base = base * randFloat(0.92, 1.1)
      history.push(parseFloat(base.toFixed(2)))
    }

    return {
      id: i,
      country: c.name,
      countryCode: c.code,
      flagEmoji: c.flag,
      clicks,
      installs,
      revenue,
      spend,
      profit: parseFloat((revenue - spend).toFixed(2)),
      dau: randInt(10_000, 2_000_000),
      revenueHistory: history,
    }
  })
}

export function generateAppData(count: number): AppRow[] {
  const data: AppRow[] = new Array(count)
  for (let i = 0; i < count; i++) {
    const app = pick(APPS)
    data[i] = {
      id: i,
      appName: app.name,
      bundleId: app.bundleId,
      category: app.category,
      installs: randInt(1000, 5_000_000),
      revenue: parseFloat(randFloat(100, 500_000).toFixed(2)),
      dau: randInt(500, 1_000_000),
      retentionD1: randFloat(0.15, 0.65),
      retentionD7: randFloat(0.05, 0.35),
      selected: false,
    }
  }
  return data
}

export function generateDailyRevenueData(): DailyRevenueRow[] {
  const data: DailyRevenueRow[] = []
  const startDate = new Date('2025-01-01')

  for (let d = 0; d < 365; d++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + d)
    const dateStr = date.toISOString().slice(0, 10)

    const sourceCount = randInt(4, 8)
    const sources: SourceBreakdown[] = []
    let totalRevenue = 0
    let totalSpend = 0

    for (let s = 0; s < sourceCount; s++) {
      const installs = randInt(100, 50_000)
      const spend = parseFloat((installs * randFloat(0.5, 4.0)).toFixed(2))
      const revenue = parseFloat((spend * randFloat(0.5, 2.5)).toFixed(2))
      sources.push({
        source: TRAFFIC_SOURCES[s % TRAFFIC_SOURCES.length] as string,
        revenue,
        spend,
        profit: parseFloat((revenue - spend).toFixed(2)),
        installs,
      })
      totalRevenue += revenue
      totalSpend += spend
    }

    data.push({
      id: d,
      date: dateStr,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      totalSpend: parseFloat(totalSpend.toFixed(2)),
      profit: parseFloat((totalRevenue - totalSpend).toFixed(2)),
      transactions: randInt(500, 50_000),
      sources,
      _expanded: false,
    })
  }
  return data
}

export function generateDragData(): DragCampaignRow[] {
  const statuses: DragCampaignRow['status'][] = ['active', 'paused', 'draft']
  return Array.from({ length: 50 }, (_, i) => {
    const installs = randInt(100, 50_000)
    const cpi = randFloat(0.3, 6.0)
    return {
      id: i,
      priority: i + 1,
      campaignName: `${pick(CAMPAIGN_PREFIXES)}_${pick(COUNTRIES).code}_${pick(APPS).name.replace(/\s/g, '')}`,
      status: pick(statuses),
      dailyBudget: parseFloat(randFloat(100, 10_000).toFixed(2)),
      spend: parseFloat((installs * cpi * randFloat(0.3, 0.9)).toFixed(2)),
      installs,
      cpi: parseFloat(cpi.toFixed(2)),
    }
  })
}
