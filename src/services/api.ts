import axios from 'axios'
import { storageUserGet } from '../storage/UserStorage'
const api = axios.create({
  baseURL: 'http://api.abiliocoelho.dev',
})

api.interceptors.request.use(
  async (request) => {
    const { token } = await storageUserGet()
    if (token) {
      request.headers.Authorization = `Bearer ${token}`
    }
    return request
  },
  (error) => Promise.reject(error),
)

export { api }
