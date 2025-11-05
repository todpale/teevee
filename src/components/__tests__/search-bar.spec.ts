import { mount } from '@vue/test-utils'
import { it, vi, expect, describe } from 'vitest'
import SearchBar from '../Dashboard/SearchBar.vue'

vi.mock('@iconify/vue', () => ({
  Icon: { name: 'IconStub', template: '<i />' }
}))
vi.mock('@/locales', () => ({
  useLocale: () => ({ t: (k: string) => k })
}))

describe('components/Dashboard/SearchBar', () => {
  it('renders placeholder from i18n and emits on button click when input has text', async () => {
    const wrapper = mount(SearchBar)

    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe('search.placeholder')

    await input.setValue('  lost  ')

    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('on-search')).toBeTruthy()
    expect(wrapper.emitted('on-search')![0]).toEqual(['lost'])
  })

  it('does not emit when trimmed input is empty', async () => {
    const wrapper = mount(SearchBar)
    const input = wrapper.find('input')

    await input.setValue('   ')
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('on-search')).toBeFalsy()
  })

  it('emits when pressing Enter', async () => {
    const wrapper = mount(SearchBar)
    const input = wrapper.find('input')

    await input.setValue('heroes')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('on-search')).toBeTruthy()
    expect(wrapper.emitted('on-search')![0]).toEqual(['heroes'])
  })
})
