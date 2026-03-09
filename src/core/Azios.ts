import dispatchRequest from "./dispatchRequest"
import { AziosRequestConfig } from "../types/config"
import InterceptorManager from "../interceptors/InterceptorManager"

export default class Azios {

  defaults: AziosRequestConfig

  interceptors: {
    request: InterceptorManager<AziosRequestConfig>
    response: InterceptorManager<any>
  }

  constructor(config: AziosRequestConfig) {

    this.defaults = config

    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    }
  }

  request(config: AziosRequestConfig) {

    config = { ...this.defaults, ...config }

    return dispatchRequest(config)
  }

  get(url: string, config?: AziosRequestConfig) {

    return this.request({
      ...config,
      method: "GET",
      url
    })
  }

  post(url: string, data?: any, config?: AziosRequestConfig) {

    return this.request({
      ...config,
      method: "POST",
      url,
      data
    })
  }

  put(url: string, data?: any, config?: AziosRequestConfig) {

  return this.request({
    ...config,
    method: "PUT",
    url,
    data
  })

}

patch(url: string, data?: any, config?: AziosRequestConfig) {

  return this.request({
    ...config,
    method: "PATCH",
    url,
    data
  })

}

delete(url: string, config?: AziosRequestConfig) {

  return this.request({
    ...config,
    method: "DELETE",
    url
  })

}

head(url: string, config?: AziosRequestConfig) {

  return this.request({
    ...config,
    method: "HEAD",
    url
  })

}

options(url: string, config?: AziosRequestConfig) {

  return this.request({
    ...config,
    method: "OPTIONS",
    url
  })

}

}