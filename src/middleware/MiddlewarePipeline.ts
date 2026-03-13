import type { AziosRequestConfig } from '../types/config'
import type { AziosResponse } from '../types/response'

/**
 * Middleware handler types
 * Supports async middleware in the style of Koa
 */
export type RequestMiddleware = (
  config: AziosRequestConfig,
  next: () => Promise<AziosResponse>
) => Promise<AziosResponse>

export type ResponseMiddleware = (
  response: AziosResponse,
  next: () => Promise<AziosResponse>
) => Promise<AziosResponse>

/**
 * Composition utility for middleware chaining
 * Implements Koa-style middleware flow control
 */
export class MiddlewarePipeline {
  private requestMiddleware: RequestMiddleware[] = []
  private responseMiddleware: ResponseMiddleware[] = []

  /**
   * Add request middleware
   * Middleware will execute in registration order
   */
  useRequest(middleware: RequestMiddleware): this {
    this.requestMiddleware.push(middleware)
    return this
  }

  /**
   * Add response middleware
   * Middleware will execute in registration order
   */
  useResponse(middleware: ResponseMiddleware): this {
    this.responseMiddleware.push(middleware)
    return this
  }

  /**
   * Compose request middleware with proper async error handling
   */
  private composeRequest(): RequestMiddleware {
    const middleware = this.requestMiddleware

    return async (config: AziosRequestConfig, next: () => Promise<AziosResponse>) => {
      let index = -1

      const dispatch = async (i: number): Promise<AziosResponse> => {
        if (i <= index) {
          throw new Error('next() called multiple times in middleware')
        }

        index = i

        try {
          if (i < middleware.length) {
            return await middleware[i](config, () => dispatch(i + 1))
          } else {
            return await next()
          }
        } catch (err) {
          throw err
        }
      }

      return dispatch(0)
    }
  }

  /**
   * Compose response middleware with proper async error handling
   */
  private composeResponse(): ResponseMiddleware {
    const middleware = this.responseMiddleware

    return async (response: AziosResponse, next: () => Promise<AziosResponse>) => {
      let index = -1

      const dispatch = async (i: number): Promise<AziosResponse> => {
        if (i <= index) {
          throw new Error('next() called multiple times in middleware')
        }

        index = i

        try {
          if (i < middleware.length) {
            return await middleware[i](response, () => dispatch(i + 1))
          } else {
            return await next()
          }
        } catch (err) {
          throw err
        }
      }

      return dispatch(0)
    }
  }

  /**
   * Execute request middleware pipeline
   */
  async executeRequestMiddleware(
    config: AziosRequestConfig,
    next: () => Promise<AziosResponse>
  ): Promise<AziosResponse> {
    if (this.requestMiddleware.length === 0) {
      return next()
    }

    const composed = this.composeRequest()
    return composed(config, next)
  }

  /**
   * Execute response middleware pipeline
   */
  async executeResponseMiddleware(
    response: AziosResponse,
    next: () => Promise<AziosResponse>
  ): Promise<AziosResponse> {
    if (this.responseMiddleware.length === 0) {
      return next()
    }

    const composed = this.composeResponse()
    return composed(response, next)
  }

  /**
   * Clear all middleware
   */
  clear(): void {
    this.requestMiddleware = []
    this.responseMiddleware = []
  }

  /**
   * Get registered middleware count
   */
  getMiddlewareCount(): { request: number; response: number } {
    return {
      request: this.requestMiddleware.length,
      response: this.responseMiddleware.length
    }
  }
}

export default MiddlewarePipeline
