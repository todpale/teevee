import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DetailsBlock from '../ShowDetails/DetailsBlock.vue'

vi.mock('@/locales', () => ({
  useLocale: () => ({ t: (k: string) => k })
}))

// Mock store import even if unused, to avoid any pinia init
vi.mock('@/stores', () => ({
  useShowsStore: () => ({})
}))

const baseShow = {
  id: 1,
  name: 'Demo',
  type: 'scripted',
  status: 'Running',
  weight: 0,
  rating: { average: 7.95 },
  updated: 0,
  language: 'EN',
  genres: ['Sci-Fi', 'Drama'],
  premiered: '2019-03-05',
  schedule: { time: '21:00', days: ['Tue'] },
  ended: null,
  runtime: 45,
  summary: '<b>Bold</b> and <i>italic</i> summary.' as string | null,
  image: { medium: 'm.jpg', original: 'o.jpg' },
  network: { id: 1, name: 'Net', country: { name: 'X', code: 'X', timezone: 'UTC' } },
  officialSite: null,
  averageRuntime: 45,
  webChannel: null
}

describe('components/ShowDetails/DetailsBlock', () => {
  it('computes network using network.name, then webChannel.name, else basic.unknown', () => {
    const w1 = mount(DetailsBlock, {
      props: { show: baseShow, seasons: [1, 2] }
    })
    expect(w1.find('.c-details-block__meta-value').text()).toBe('Net')

    const withWeb = { ...baseShow, network: null, webChannel: { id: 9, name: 'WebNet', country: null } }
    const w2 = mount(DetailsBlock, { props: { show: withWeb, seasons: [1] } })
    // first meta item is network
    expect(w2.findAll('.c-details-block__meta-value')[0].text()).toBe('WebNet')

    const none = { ...baseShow, network: null, webChannel: null }
    const w3 = mount(DetailsBlock, { props: { show: none, seasons: [] } })
    expect(w3.findAll('.c-details-block__meta-value')[0].text()).toBe('basic.unknown')
  })

  it('formats yearsOnAir correctly with ended/present/unknown', () => {
    const both = { ...baseShow, premiered: '2010-01-01', ended: '2015-06-01' }
    const w1 = mount(DetailsBlock, { props: { show: both, seasons: [] } })
    expect(w1.findAll('.c-details-block__meta-value')[1].text()).toBe('2010 - 2015')

    const present = { ...baseShow, premiered: '2012-01-01', ended: null }
    const w2 = mount(DetailsBlock, { props: { show: present, seasons: [] } })
    expect(w2.findAll('.c-details-block__meta-value')[1].text()).toBe('2012 - basic.present')

    const unknown = { ...baseShow, premiered: undefined as unknown as string, ended: null }
    const w3 = mount(DetailsBlock, { props: { show: unknown, seasons: [] } })
    expect(w3.findAll('.c-details-block__meta-value')[1].text()).toBe('basic.unknown')
  })

  it('formats rating and runtime, and cleans summary HTML with fallback', () => {
    const w = mount(DetailsBlock, { props: { show: baseShow, seasons: [1, 2, 3] } })
    // rating is 7.95 -> 8.0
    const values = w.findAll('.c-details-block__meta-value')
    const ratingText = values[3].text()
    expect(ratingText).toBe('8.0')

    const runtimeText = values[4].text()
    expect(runtimeText).toBe('45 min')

    // summary cleaned
    expect(w.find('.c-details-block__summary-text').text()).toBe('Bold and italic summary.')

    // no rating/runtime/summary
    const none = { ...baseShow, rating: { average: null }, runtime: null, averageRuntime: null, summary: null }
    const w2 = mount(DetailsBlock, { props: { show: none, seasons: [] } })
    const values2 = w2.findAll('.c-details-block__meta-value')
    expect(values2[3].text()).toBe('not.applicable')
    expect(values2[4].text()).toBe('not.applicable')
    expect(w2.find('.c-details-block__summary-text').text()).toBe('not.summary')
  })

  it('exposes a meta array rendered with translated titles and derived descriptions', () => {
    const w = mount(DetailsBlock, { props: { show: baseShow, seasons: [1, 2, 3, 4] } })
    const labels = w.findAll('.c-details-block__meta-label').map(n => n.text())
    expect(labels).toEqual([
      'show.network',
      'show.year',
      'show.season',
      'show.rating',
      'show.runtime',
      'show.status',
      'show.language',
      'show.genre'
    ])

    const desc = w.findAll('.c-details-block__meta-value').map(n => n.text())
    expect(desc[2]).toBe('4') // seasons length
    expect(desc[6]).toBe('EN')
  })
})
