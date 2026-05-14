import axios from 'axios'

const api = axios.create({
  baseURL: 'https://backend-production-2d03.up.railway.app/api'
})

export default api
