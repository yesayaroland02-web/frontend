import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend-production-87647.up.railway.app/'
})

export default api
