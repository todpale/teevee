import Axios, { type AxiosError, type AxiosInstance, type AxiosResponse } from 'axios'

const $http: AxiosInstance = Axios.create({
  baseURL: 'https://api.tvmaze.com',
  timeout: 10000,
  headers: {
    'Accept-Language': 'en'
  }
})

$http.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data = {} } = response || { data: {} }
    return data
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

export { $http }
