import { AziosRequestConfig } from "./config"

/**
 * Azios HTTP response object
 * Returned by all request methods
 */
export interface AziosResponse<T = any> {
  /**
   * Response data (parsed if JSON)
   */
  data: T

  /**
   * HTTP status code
   */
  status: number

  /**
   * HTTP status text
   */
  statusText: string

  /**
   * Response headers
   */
  headers: Record<string, any>

  /**
   * Original request config
   */
  config: AziosRequestConfig

  /**
   * Native request object (if available)
   */
  request?: any
}