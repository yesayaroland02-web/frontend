import axios from 'axios'

const api = axios.create({
  baseURL: 'https://yesaya.onrender.com/api'
})

export default api