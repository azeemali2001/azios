import type { AziosRequestConfig } from '../types/config'
import type { AziosResponse } from '../types/response'

/**
 * Universal HTTP adapter interface
 * Abstracts HTTP functionality across different runtimes
 */
export interface HttpAdapter {
  /**
   * Execute an HTTP request
   */
  request(config: AziosRequestConfig): Promise<AziosResponse>

  /**
   * Method to check if adapter supports the current runtime
   */
  isSupported(): boolean
}

/**
 * Base adapter class with common logic
 */
export abstract class BaseAdapter implements HttpAdapter {
  abstract request(config: AziosRequestConfig): Promise<AziosResponse>
  abstract isSupported(): boolean
}
