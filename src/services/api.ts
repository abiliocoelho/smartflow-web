import axios from 'axios'
import { storageUserGet } from '../storage/UserStorage'
const api = axios.create({
  baseURL: 'http://137.184.232.116',
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
