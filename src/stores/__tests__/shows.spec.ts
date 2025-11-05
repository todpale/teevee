import { useShowsStore } from '../shows'
import { createPinia, setActivePinia } from 'pinia'
import type { Show, Episode, SearchResult } from '@/types'
import { it, vi, expect, describe, beforeEach } from 'vitest'

// Prepare a controllable mock for $http.get used by the store actions
// Use vi.hoisted so the mock reference exists when vi.mock is hoisted
const getMock = vi.hoisted(() => vi.fn<[
  url: string,
  config?: unknown
], Promise<any>>())

vi.mock('@/utils', () => ({
  $http: { get: getMock }
}))

// Simple factories to create fully-typed fixtures without verbosity
function makeShow(partial: Partial<Show> = {}): Show {
  return {
    id: 0,
    name: 'Sample',
    type: 'Scripted',
    status: 'Running',
    weight: 0,
    rating: { average: null },
    updated: 0,
    language: 'en',
    genres: [],
    premiered: '2020-01-01',
    schedule: { time: '20:00', days: [] },
    ended: null,
    runtime: null,
    summary: null,
    image: null,
    network: null,
    officialSite: null,
    averageRuntime: null,
    webChannel: null,
    ...partial
  }
}

function makeEpisode(partial: Partial<Episode> = {}): Episode {
  return {
    id: 0,
    url: 'https://example.com',
    name: 'Ep',
    type: 'regular',
    season: 1,
    number: 1,
    rating: { average: null },
    airdate: '2020-01-01',
    airtime: '20:00',
    runtime: 60,
    airstamp: '2020-01-01T20:00:00Z',
    summary: null,
    image: null,
    ...partial
  }
}

describe('useShowsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    getMock.mockReset()
  })

  it('has proper default state', () => {
    const store = useShowsStore()
    expect(store.shows).toEqual([])
    expect(store.show).toEqual({} as Show)
    expect(store.episodes).toEqual([])
  })

  it('getter getGenres deduplicates and sorts genres', () => {
    const store = useShowsStore()
    store.shows = [
      makeShow({ id: 1, genres: ['Drama', 'Sci-Fi'] }),
      makeShow({ id: 2, genres: ['Comedy', 'Drama'] }),
      makeShow({ id: 3, genres: [] })
    ]
    expect(store.getGenres).toEqual(['Comedy', 'Drama', 'Sci-Fi'])
  })

  it('getter getSeasons deduplicates and sorts seasons numerically', () => {
    const store = useShowsStore()
    store.episodes = [
      makeEpisode({ id: 11, season: 3 }),
      makeEpisode({ id: 12, season: 1 }),
      makeEpisode({ id: 13, season: 2 }),
      makeEpisode({ id: 14, season: 2 })
    ]
    expect(store.getSeasons).toEqual([1, 2, 3])
  })

  it('action fetchShows populates shows', async () => {
    const store = useShowsStore()
    const payload: Show[] = [
      makeShow({ id: 10, genres: ['Action'] }),
      makeShow({ id: 11, genres: ['Drama'] })
    ]

    getMock.mockResolvedValueOnce(payload)

    await store.fetchShows()

    expect(getMock).toHaveBeenCalledWith('/shows')
    expect(store.shows).toEqual(payload)
  })

  it('action fetchShow populates show', async () => {
    const store = useShowsStore()
    const show = makeShow({ id: 42, name: 'The Answer' })

    getMock.mockResolvedValueOnce(show)

    await store.fetchShow('42')

    expect(getMock).toHaveBeenCalledWith('/shows/42')
    expect(store.show).toEqual(show)
  })

  it('action fetchEpisodes populates episodes', async () => {
    const store = useShowsStore()
    const eps: Episode[] = [
      makeEpisode({ id: 101, season: 1 }),
      makeEpisode({ id: 102, season: 2 })
    ]

    getMock.mockResolvedValueOnce(eps)

    await store.fetchEpisodes('7')

    expect(getMock).toHaveBeenCalledWith('/shows/7/episodes')
    expect(store.episodes).toEqual(eps)
  })

  it('action searchShows maps SearchResult[] to shows[] and passes query param', async () => {
    const store = useShowsStore()

    const s1 = makeShow({ id: 1, name: 'A' })
    const s2 = makeShow({ id: 2, name: 'B' })

    const searchPayload: SearchResult[] = [
      { show: s1, score: 0.9 },
      { show: s2, score: 0.8 }
    ]

    getMock.mockResolvedValueOnce(searchPayload)

    await store.searchShows('space')

    expect(getMock).toHaveBeenCalledWith('/search/shows', { params: { q: 'space' } })
    expect(store.shows).toEqual([s1, s2])
  })

  it('edge cases: getters on empty state return empty arrays', () => {
    const store = useShowsStore()
    store.shows = []
    store.episodes = []
    expect(store.getGenres).toEqual([])
    expect(store.getSeasons).toEqual([])
  })
})
