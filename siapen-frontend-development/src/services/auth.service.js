import axios from 'axios'
import decode from 'jwt-decode'
import router from '@/router'
import store from '@/store'

const request = axios.create({
  baseURL: process.env.VUE_APP_ROOT_API
})

export const handleLogin = data => {
  return request.post('/api/token/', data)
}

export const setToken = res => {
  const user = JSON.stringify(decode(res.data.access))
  localStorage.setItem('siapen@accessToken', res.data.access)
  localStorage.setItem('siapen@refreshToken', res.data.refresh)
  localStorage.setItem('siapen@user', user)
  router.push('/')
}

export const isValidToken = token => {
  if (!token) {
    return false
  }

  const decoded = decode(token)
  const currentTime = Date.now() / 1000
  return decoded.exp > currentTime
}

export const refreshToken = async () => {
  request
    .post('/api/token/refresh/', {refresh: localStorage.getItem('siapen@refreshToken')})
    .then(res => {
      const user = JSON.stringify(decode(res.data.access))
      localStorage.setItem('siapen@accessToken', res.data.access)
      localStorage.setItem('siapen@user', user)
    })
    .catch(() => {
      clearToken()
    })
}

export const clearToken = () => {
  localStorage.removeItem('siapen@accessToken')
  localStorage.removeItem('siapen@refreshToken')
  localStorage.removeItem('siapen@user')
}

export const getUser = () => {
  return JSON.parse(localStorage.getItem('siapen@user'))
}

export const setBackVersion = async () => {
  store.commit('loading/setLoading', true)
  request
    .get('/api/versao/')
    .then(res => {
      localStorage.setItem('siapen@backVersion', res.data.numero)
      store.commit('loading/setLoading', false)
    })
}

export const getBackVersion = () => {
  return localStorage.getItem('siapen@backVersion')
}