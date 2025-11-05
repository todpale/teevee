import TopBar from '../TopBar.vue'
import { mount } from '@vue/test-utils'
import { it, vi, expect, describe, beforeEach } from 'vitest'

vi.mock('@iconify/vue', () => ({
  Icon: { name: 'IconStub', template: '<i />' }
}))
vi.mock('@/locales', () => ({
  useLocale: () => ({ t: (k: string) => k })
}))

const factory = () => mount(TopBar)

describe('components/TopBar', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
  })

  it('renders logo, title and github link', () => {
    const wrapper = factory()
    expect(wrapper.find('img[alt="logo"]').exists()).toBe(true)
    expect(wrapper.find('.c-top-bar__title').text()).toBe('app.name')
    const link = wrapper.find('a.c-top-bar__link')
    expect(link.attributes('href')).toContain('github.com')
  })

  it('applies top class by default and toggles to scrolled on window scroll', async () => {
    const wrapper = factory()
    expect(wrapper.classes()).toContain('c-top-bar--top')

    window.scrollY = 20
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    expect(wrapper.classes()).toContain('c-top-bar--scrolled')
  })

  it('removes event listener on unmount (no errors when dispatching after unmount)', () => {
    const wrapper = factory()
    wrapper.unmount()
    expect(() => window.dispatchEvent(new Event('scroll'))).not.toThrow()
  })
})
