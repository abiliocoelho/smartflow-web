import axios from 'axios'
import { storageUserGet } from '../storage/UserStorage'
const api = axios.create({
  baseURL: 'http://localhost:3333',
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
