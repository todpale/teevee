import { mount } from '@vue/test-utils'
import PageFooter from '../PageFooter.vue'
import { it, vi, expect, describe } from 'vitest'

vi.mock('@/locales', () => ({
  useLocale: () => ({ t: (k: string) => k })
}))

describe('components/PageFooter', () => {
  it('renders created text and vue link/logo', () => {
    const wrapper = mount(PageFooter)

    expect(wrapper.find('.c-page-footer').exists()).toBe(true)
    expect(wrapper.find('.c-page-footer__created span').text()).toBe('app.created')

    const link = wrapper.find('a[href*="vuejs.org"]')
    expect(link.exists()).toBe(true)
    expect(link.attributes('target')).toBe('_blank')
    expect(link.find('img').exists()).toBe(true)
  })
})
