type Rating = {
  average: number | null
}

type Schedule = {
  time: string
  days: string[]
}

type ItemImage = {
  medium: string
  original: string
}

type Country = {
  name: string
  code: string
  timezone: string
}

type Network = {
  id: number
  name: string
  country: Country
}

type WebChannel = {
  id: number
  name: string
  country: Country | null
}

interface Show {
  id: number
  name: string
  type: string
  status: string
  weight: number
  rating: Rating
  updated: number
  language: string
  genres: string[]
  premiered: string
  schedule: Schedule
  ended: string | null
  runtime: number | null
  summary: string | null
  image: ItemImage | null
  network: Network | null
  officialSite: string | null
  averageRuntime: number | null
  webChannel: WebChannel | null
}

type SearchResult = {
  show: Show
  score: number
}

interface Episode {
  id: number
  url: string
  name: string
  type: string
  season: number
  number: number
  rating: Rating
  airdate: string
  airtime: string
  runtime: number
  airstamp: string
  summary: string | null
  image: ItemImage | null
}

export type {
  Show,
  Episode,
  ItemImage,
  SearchResult
}
