import axios from 'axios'

const api = axios.create({
  baseURL: 'backend-production-2d03.up.railway.app'
})

export default api
