import { it, vi, expect, describe } from 'vitest'

// Mock the lazy-loaded view components so dynamic imports don't pull real SFCs
vi.mock('@/views/Dashboard/index.vue', () => ({
  default: { name: 'MockDashboard' }
}))
vi.mock('@/views/ShowDetails/index.vue', () => ({
  default: { name: 'MockShowDetail' }
}))

// Import router after mocks are declared so its dynamic import callbacks resolve to the mocks
import router from '@/router'

describe('router/index', () => {
  it('exposes two routes with correct names and paths', () => {
    const routes = router.getRoutes()

    const names = routes.map(r => r.name)
    expect(names).toContain('Dashboard')
    expect(names).toContain('ShowDetail')

    const dashboard = routes.find(r => r.name === 'Dashboard')!
    const detail = routes.find(r => r.name === 'ShowDetail')!

    expect(dashboard.path).toBe('/')
    expect(detail.path).toBe('/show/:id')
  })

  it('defines lazy components for each route and they resolve via mocked modules', async () => {
    const routes = router.getRoutes()
    const dashboard = routes.find(r => r.name === 'Dashboard')!
    const detail = routes.find(r => r.name === 'ShowDetail')!

    // In normalized route records, `components.default` contains the loader when using `component`
    const dashLoader = (dashboard.components && dashboard.components.default) as unknown as (() => Promise<any>)
    const detailLoader = (detail.components && detail.components.default) as unknown as (() => Promise<any>)

    expect(typeof dashLoader).toBe('function')
    expect(typeof detailLoader).toBe('function')

    const dashMod = await dashLoader()
    const detailMod = await detailLoader()

    expect(dashMod).toHaveProperty('default')
    expect(detailMod).toHaveProperty('default')
    expect(dashMod.default.name).toBe('MockDashboard')
    expect(detailMod.default.name).toBe('MockShowDetail')
  })

  it('passes props to ShowDetail via props:true', () => {
    const routes = router.getRoutes()
    const detail = routes.find(r => r.name === 'ShowDetail')!

    // When normalized, `props` is stored per view in an object keyed by the view name
    // For single-view routes, the key is `default`.
    expect(detail.props).toBeDefined()
    expect(detail.props.default).toBe(true)
  })
})
