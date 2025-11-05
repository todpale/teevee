import { $http } from '@/utils'
import { defineStore } from 'pinia'
import type { Show, Episode, SearchResult } from '@/types'

export const useShowsStore = defineStore('shows', {
  state: () => ({
    shows: [] as Show[],
    show: {} as Show,

    episodes: [] as Episode[]
  }),

  getters: {
    getGenres: (state) => {
      const genreSet = new Set<string>()

      state.shows.forEach(show => {
        show.genres.forEach(genre => genreSet.add(genre))
      })

      return Array.from(genreSet).sort()
    },

    getSeasons: (state) => {
      const seasons = new Set<number>()

      state.episodes.forEach((episode) => {
        seasons.add(episode.season)
      })

      return Array.from(seasons).sort((a, b) => a - b)
    }
  },

  actions: {
    async fetchShows(): Promise<void> {
      this.shows = await $http.get('/shows')
    },

    async fetchShow(id: string): Promise<void> {
      this.show = await $http.get(`/shows/${id}`)
    },

    async fetchEpisodes(showId: string): Promise<void> {
      this.episodes = await $http.get(`/shows/${showId}/episodes`)
    },

    async searchShows(query: string): Promise<void> {
      const response: SearchResult[] = await $http.get('/search/shows', { params: { q: query } })
      this.shows = response.map((result) => result.show)
    }
  }
})
