import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { it, vi, expect, describe } from 'vitest'
import EpisodesBlock from '../ShowDetails/EpisodesBlock.vue'

vi.mock('@/locales', () => ({
  useLocale: () => ({ t: (k: string) => k })
}))

const episodes = [
  {
    id: 1,
    url: '',
    name: 'Pilot',
    type: 'regular',
    season: 1,
    number: 1,
    rating: { average: 7.2 },
    airdate: '2020-01-01',
    airtime: '20:00',
    runtime: 60,
    airstamp: '2020-01-01T20:00:00Z',
    summary: '<b>Bold</b> summary',
    image: { medium: 'm1.jpg', original: 'o1.jpg' }
  },
  {
    id: 2,
    url: '',
    name: 'Second',
    type: 'regular',
    season: 1,
    number: 2,
    rating: { average: 7.3 },
    airdate: '',
    airtime: '20:00',
    runtime: 60,
    airstamp: '2020-01-08T20:00:00Z',
    summary: null,
    image: null
  },
  {
    id: 3,
    url: '',
    name: 'S2 Premiere',
    type: 'regular',
    season: 2,
    number: 1,
    rating: { average: 7.9 },
    airdate: '2020-02-01',
    airtime: '20:00',
    runtime: 60,
    airstamp: '2020-02-01T20:00:00Z',
    summary: 'No tags here',
    image: { medium: 'm3.jpg', original: '' as unknown as string }
  }
]

vi.mock('@/stores', () => ({
  useShowsStore: () => ({ episodes })
}))

describe('components/ShowDetails/EpisodesBlock', () => {
  it('renders episodes for selected season (defaults to 1), cleans summary and formats date', () => {
    const wrapper = mount(EpisodesBlock, { props: { seasons: [1, 2] } })

    const episodeCards = wrapper.findAll('.c-episodes-block__episode')
    expect(episodeCards.length).toBe(2)

    expect(episodeCards?.[0]?.find('.c-episodes-block__episode-summary').text()).toBe('Bold summary')

    expect(episodeCards?.[1]?.find('.c-episodes-block__episode-summary').text()).toBe('not.summary')

    const dateText1 = episodeCards?.[0]?.find('.c-episodes-block__episode-date').text()
    expect(dateText1).toMatch(/2020/) // year

    const dateText2 = episodeCards?.[1]?.find('.c-episodes-block__episode-date').text()
    expect(dateText2).toBe('TBA')
  })

  it('selects season via button click and updates active class and list', async () => {
    const wrapper = mount(EpisodesBlock, { props: { seasons: [1, 2] } })

    let buttons = wrapper.findAll('.c-episodes-block__season-button')
    expect(buttons.length).toBe(2)

    expect(buttons?.[0]?.classes()).toContain('show-detail__season-button--active')

    await buttons?.[1]?.trigger('click')
    await nextTick()
    buttons = wrapper.findAll('.c-episodes-block__season-button')

    expect(buttons?.[1]?.classes()).toContain('show-detail__season-button--active')

    const episodeCards = wrapper.findAll('.c-episodes-block__episode')
    expect(episodeCards.length).toBe(1)
    expect(episodeCards?.[0]?.find('.c-episodes-block__episode-number').text()).toBe('1')
  })

  it('picks episode picture: prefers original, then medium, else placeholder', async () => {
    const wrapper = mount(EpisodesBlock, { props: { seasons: [1, 2] } })

    let imgs = wrapper.findAll('.c-episodes-block__episode-picture img')
    expect(imgs?.[0]?.attributes('src')).toBe('o1.jpg')

    const buttons = wrapper.findAll('.c-episodes-block__season-button')
    await buttons?.[1]?.trigger('click')
    await nextTick()

    imgs = wrapper.findAll('.c-episodes-block__episode-picture img')
    expect(imgs?.[0]?.attributes('src')).toBe('m3.jpg')

    await buttons?.[0]?.trigger('click')
    await nextTick()
    imgs = wrapper.findAll('.c-episodes-block__episode-picture img')
    expect(imgs?.[1]?.attributes('src')).toBe('./placeholder.webp')
  })
})
