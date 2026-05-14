import axios from 'axios'

const api = axios.create({
  baseURL: 'https://backend-production-87647.up.railway.app/api'
})

export default api
