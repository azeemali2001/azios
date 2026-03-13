import dispatchRequest from "./dispatchRequest"
import { AziosRequestConfig } from "../types/config"
import type { AziosInstance } from "../types/request"
import type { AziosPlugin } from "../types/plugin"
import InterceptorManager from "../interceptors/InterceptorManager"
import PluginManager from "../plugins/pluginManager"
import MiddlewareManager from "../middleware/middlewareManager"
import { compose } from "../middleware/compose"

/**
 * Core Azios HTTP client class
 * Production-grade implementation with plugin system, middleware, and interceptors
 */
export default class Azios {
  defaults: AziosRequestConfig

  interceptors: {
    request: InterceptorManager<AziosRequestConfig>
    response: InterceptorManager<any>
  }

  middlewares: MiddlewareManager
  plugins: PluginManager

  constructor(config: AziosRequestConfig) {
    this.defaults = config

    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    }

    this.middlewares = new MiddlewareManager()
    this.plugins = new PluginManager()
  }

  /**
   * Register middleware using Koa-style middleware pattern
   */
  use(fn: any) {
    this.middlewares.use(fn)
  }

  /**
   * Install a plugin into this instance
   * @throws Error if plugin is already installed or installation fails
   */
  async installPlugin(plugin: AziosPlugin): Promise<void> {
    await this.plugins.install(plugin, this as any as AziosInstance)
  }

  /**
   * Uninstall a plugin by name
   */
  async uninstallPlugin(pluginName: string): Promise<void> {
    await this.plugins.uninstall(pluginName, this as any as AziosInstance)
  }

  /**
   * Core request method - central request pipeline
   */
  async request(config: AziosRequestConfig): Promise<any> {
    config = { ...this.defaults, ...config }

    // -------------------------
    // PLUGIN: PRE-REQUEST HOOKS
    // -------------------------
    config = await this.plugins.executeBeforeRequestHooks(config)

    // -------------------------
    // MIDDLEWARE PIPELINE
    // -------------------------
    const context = { config }
    const fn = compose(this.middlewares.middlewares)
    await fn(context)
    config = context.config

    // -------------------------
    // INTERCEPTOR PIPELINE
    // -------------------------
    const chain: any[] = []

    // Request interceptors (reverse order)
    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor.fulfilled, interceptor.rejected)
    })

    // Main dispatch
    chain.push(dispatchRequest, undefined)

    // Response interceptors (normal order)
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor.fulfilled, interceptor.rejected)
    })

    let promise = Promise.resolve(config)

    while (chain.length) {
      const fulfilled = chain.shift()
      const rejected = chain.shift()
      promise = promise.then(fulfilled, rejected)
    }

    try {
      const response = await promise as any

      // -------------------------
      // PLUGIN: POST-RESPONSE HOOKS
      // -------------------------
      return await this.plugins.executeAfterResponseHooks(response)
    } catch (error) {
      // -------------------------
      // PLUGIN: ERROR HOOKS
      // -------------------------
      if (error instanceof Error) {
        throw await this.plugins.executeOnErrorHooks(error)
      }
      throw error
    }
  }

  // =========================================
  // HTTP METHODS
  // =========================================

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