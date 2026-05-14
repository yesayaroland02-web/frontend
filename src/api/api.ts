import axios from 'axios'

const api = axios.create({
  baseURL: 'https://backend-production-0f56.up.railway.app/api'
})

export default api
