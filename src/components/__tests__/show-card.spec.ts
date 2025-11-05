import { h } from 'vue'
import { mount } from '@vue/test-utils'
import ShowCard from '../Dashboard/ShowCard.vue'
import { it, vi, expect, describe } from 'vitest'

vi.mock('@/locales', () => ({
  useLocale: () => ({ t: (k: string) => k })
}))

const RouterLinkStub = {
  name: 'RouterLink',
  props: ['to'],
  render() {
    const to = (this as any).to
    const href = typeof to === 'string' ? to : (to?.path || '')
    return h('a', { href, class: 'router-link-stub' }, this.$slots.default ? this.$slots.default() : [])
  }
}

const baseShow = {
  id: 42,
  name: 'The Answer',
  type: 'scripted',
  status: 'Running',
  weight: 0,
  rating: { average: 8.234 },
  updated: 0,
  language: 'EN',
  genres: ['Sci-Fi', 'Drama'],
  premiered: '2020-01-02',
  schedule: { time: '22:00', days: ['Fri'] },
  ended: null,
  runtime: 60,
  summary: 'Summary',
  image: { medium: 'm.jpg', original: 'o.jpg' },
  network: { id: 1, name: 'Net', country: { name: 'X', code: 'X', timezone: 'UTC' } },
  officialSite: null,
  averageRuntime: 60,
  webChannel: null
}

describe('components/Dashboard/ShowCard', () => {
  it('renders link to details using show.id', () => {
    const wrapper = mount(ShowCard, {
      props: { show: baseShow },
      global: { stubs: { RouterLink: RouterLinkStub } }
    })

    const link = wrapper.find('a.router-link-stub.c-show-card')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('/show/42')
  })

  it('uses provided image when available, else falls back to placeholder', async () => {
    const withImage = mount(ShowCard, {
      props: { show: baseShow },
      global: { stubs: { RouterLink: RouterLinkStub } }
    })
    expect(withImage.find('img').attributes('src')).toBe('m.jpg')

    const noImageShow = { ...baseShow, image: null }
    const withoutImage = mount(ShowCard, {
      props: { show: noImageShow },
      global: { stubs: { RouterLink: RouterLinkStub } }
    })
    expect(withoutImage.find('img').attributes('src')).toBe('./placeholder.webp')
  })

  it('formats rating to one decimal or uses t("not.applicable") when absent', () => {
    const wrapper = mount(ShowCard, {
      props: { show: baseShow },
      global: { stubs: { RouterLink: RouterLinkStub } }
    })
    expect(wrapper.find('.c-show-card__rating').text()).toContain('8.2')

    const noRating = { ...baseShow, rating: { average: null } }
    const wrapper2 = mount(ShowCard, {
      props: { show: noRating },
      global: { stubs: { RouterLink: RouterLinkStub } }
    })
    expect(wrapper2.find('.c-show-card__rating').text()).toContain('not.applicable')
  })

  it('shows primary genre or falls back to t("basic.unknown")', () => {
    const wrapper = mount(ShowCard, {
      props: { show: baseShow },
      global: { stubs: { RouterLink: RouterLinkStub } }
    })
    expect(wrapper.find('.c-show-card__genre').text()).toBe('Sci-Fi')

    const noGenres = { ...baseShow, genres: [] as string[] }
    const wrapper2 = mount(ShowCard, {
      props: { show: noGenres },
      global: { stubs: { RouterLink: RouterLinkStub } }
    })
    expect(wrapper2.find('.c-show-card__genre').text()).toBe('basic.unknown')
  })
})
