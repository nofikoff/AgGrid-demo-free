import type { CampaignRow, CountryRow, AppRow, DailyRevenueRow, DragCampaignRow } from '../types/adtech'
import {
  generateCampaignData,
  generateCountryData,
  generateAppData,
  generateDailyRevenueData,
  generateDragData,
} from './generators'

let campaignCache: CampaignRow[] | null = null
let countryCache: CountryRow[] | null = null
let appCache: AppRow[] | null = null
let dailyRevenueCache: DailyRevenueRow[] | null = null
let dragCache: DragCampaignRow[] | null = null

export function getCampaignData(count = 100_000): CampaignRow[] {
  if (!campaignCache) {
    campaignCache = generateCampaignData(count)
  }
  return campaignCache
}

export function getCountryData(): CountryRow[] {
  if (!countryCache) {
    countryCache = generateCountryData()
  }
  return countryCache
}

export function getAppData(count = 50_000): AppRow[] {
  if (!appCache) {
    appCache = generateAppData(count)
  }
  return appCache
}

export function getDailyRevenueData(): DailyRevenueRow[] {
  if (!dailyRevenueCache) {
    dailyRevenueCache = generateDailyRevenueData()
  }
  return dailyRevenueCache
}

export function getDragData(): DragCampaignRow[] {
  if (!dragCache) {
    dragCache = generateDragData()
  }
  return dragCache
}
