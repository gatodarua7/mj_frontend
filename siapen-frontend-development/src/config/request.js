import axios from 'axios'
import store from '@/store'
import { isValidToken, refreshToken } from '@/services/auth.service'

const request = axios.create({
  baseURL: process.env.VUE_APP_ROOT_API,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

request.interceptors.request.use((config) => {
  store.commit('loading/setLoading', true)
  const token = localStorage.getItem('siapen@accessToken')

  if (token && isValidToken(token)) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
}, (err) => {
  return Promise.reject(err)
})

request.interceptors.response.use((response) => {
  store.commit('loading/setLoading', false)
  return response
}, (error) => {
  store.commit('loading/setLoading', false)
  if (error.response.status === 401) {
    refreshToken()
  }

  return Promise.reject(error)
})

export default request