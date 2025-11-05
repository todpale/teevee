import { mount } from '@vue/test-utils'
import { it, vi, expect, describe } from 'vitest'
import LoadingSpinner from '../LoadingSpinner.vue'

vi.mock('@/locales', () => ({
  useLocale: () => ({ t: (k: string) => k })
}))

describe('components/LoadingSpinner', () => {
  it('renders spinner container and animated element', () => {
    const wrapper = mount(LoadingSpinner)
    expect(wrapper.classes()).toContain('c-loading-spinner')
    const spinner = wrapper.find('.spinner')
    expect(spinner.exists()).toBe(true)
  })
})
