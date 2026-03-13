import { AziosRequestConfig } from './config'
import { AziosResponse } from './response'

/**
 * Middleware function type for request/response processing
 * Koa-style middleware pattern that receives context and next function
 */
export type AziosMiddleware = (
  config: AziosRequestConfig,
  next: (cfg?: AziosRequestConfig) => Promise<AziosResponse>
) => Promise<AziosResponse>

/**
 * Middleware context for tracking state across pipeline
 */
export interface MiddlewareContext {
  startTime?: number
  endTime?: number
  config: AziosRequestConfig
  metadata?: Record<string, any>
}
