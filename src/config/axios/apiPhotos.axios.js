import axios from 'axios'

const apiPhotos = axios.create({
  baseURL: 'https://fed-team.modyo.cloud/api/content/spaces/animals/types/game/entries'
})

apiPhotos.interceptors.request.use(function (config) {
  config.params = { ...config.params}
  return config
})

export { apiPhotos }
