import axios from 'axios'

const soceisiApi = axios.create({
  baseURL: 'https://soceisi-incsripcion-backend.vercel.app/',
  timeOut: 1000,
  Headers: {
    Accept: 'application/json',
  },
})

soceisiApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(`Error en la peticion:`, error.response?.data || error.message)
    return Promise.reject(error)
  },
)

export default soceisiApi
