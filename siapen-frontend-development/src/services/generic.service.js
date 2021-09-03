import http from '@/config/request'

class APIProvider {
  /* Esta classe fornece um modelo genérico
  para as requisições com o backend */

  list ({ resource, query }) {
    return http.get(`${resource}/`, {
      params: query
    })
  }

  get ({ resource, id, query }) {
    return http.get(`${resource}/${id}/`, {
      params: query
    })
  }

  create ({ resource, data, query }) {
    return http.post(`${resource}/`, data, {
      params: query
    })
  }

  update ({ resource, id, data, query }) {
    return http.patch(`${resource}/${id}/`, data, {
      params: query
    })
  }

  destroy ({ resource, id, data }) {
    return http.delete(`${resource}/${id}/`, data)
  }
}

export default new APIProvider()