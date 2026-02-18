import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/campaign-report' },
    {
      path: '/campaign-report',
      name: 'CampaignReport',
      component: () => import('../views/CampaignReport.vue'),
      meta: { title: 'Campaign Report', icon: 'chart-bar' },
    },
    {
      path: '/country-breakdown',
      name: 'CountryBreakdown',
      component: () => import('../views/CountryBreakdown.vue'),
      meta: { title: 'Country Breakdown', icon: 'globe' },
    },
    {
      path: '/app-performance',
      name: 'AppPerformance',
      component: () => import('../views/AppPerformance.vue'),
      meta: { title: 'App Performance', icon: 'speedometer' },
    },
    {
      path: '/daily-revenue',
      name: 'DailyRevenue',
      component: () => import('../views/DailyRevenue.vue'),
      meta: { title: 'Daily Revenue', icon: 'calendar' },
    },
    {
      path: '/drag-drop',
      name: 'DragDropPriority',
      component: () => import('../views/DragDropPriority.vue'),
      meta: { title: 'Drag & Drop Priority', icon: 'drag' },
    },
  ],
})

export default router
