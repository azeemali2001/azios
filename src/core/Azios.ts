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

    const chain: any[] = []

    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor.fulfilled, interceptor.rejected)
    })

    chain.push(dispatchRequest, undefined)

    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor.fulfilled, interceptor.rejected)
    })

    let promise = Promise.resolve(config)

    while (chain.length) {

      const fulfilled = chain.shift()
      const rejected = chain.shift()

      promise = promise.then(fulfilled, rejected)

    }

    return promise

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