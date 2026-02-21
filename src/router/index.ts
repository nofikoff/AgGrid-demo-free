import { createRouter, createWebHistory } from 'vue-router'

const DEMO_ROUTES = [
  {
    path: 'campaign-report',
    name: 'CampaignReport',
    component: () => import('../views/wrappers/CampaignReportWrapper.vue'),
    meta: { title: 'Campaign Report', icon: 'chart-bar' },
  },
  {
    path: 'country-breakdown',
    name: 'CountryBreakdown',
    component: () => import('../views/wrappers/CountryBreakdownWrapper.vue'),
    meta: { title: 'Country Breakdown', icon: 'globe' },
  },
  {
    path: 'app-performance',
    name: 'AppPerformance',
    component: () => import('../views/wrappers/AppPerformanceWrapper.vue'),
    meta: { title: 'App Performance', icon: 'speedometer' },
  },
  {
    path: 'daily-revenue',
    name: 'DailyRevenue',
    component: () => import('../views/wrappers/DailyRevenueWrapper.vue'),
    meta: { title: 'Daily Revenue', icon: 'calendar' },
  },
  {
    path: 'drag-drop',
    name: 'DragDropPriority',
    component: () => import('../views/wrappers/DragDropPriorityWrapper.vue'),
    meta: { title: 'Drag & Drop Priority', icon: 'drag' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/aggrid/campaign-report' },
    // Backward-compatible redirects for old paths
    { path: '/campaign-report', redirect: '/aggrid/campaign-report' },
    { path: '/country-breakdown', redirect: '/aggrid/country-breakdown' },
    { path: '/app-performance', redirect: '/aggrid/app-performance' },
    { path: '/daily-revenue', redirect: '/aggrid/daily-revenue' },
    { path: '/drag-drop', redirect: '/aggrid/drag-drop' },
    {
      path: '/:engine(aggrid|tabulator|primevue)',
      children: [
        { path: '', redirect: (to) => `${to.path}/campaign-report` },
        ...DEMO_ROUTES,
      ],
    },
  ],
})

export default router
