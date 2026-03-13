import type { AziosRequestConfig } from '../types/config'
import type { AziosResponse } from '../types/response'
import { BaseAdapter } from './HttpAdapter'
import AziosError from '../errors/AziosError'
import { isRuntime, RuntimeType } from './detectRuntime'

/**
 * Unified HTTP adapter using Fetch API
 * Works across Node 18+, browsers, Bun, Deno, and edge runtimes
 * Falls back to runtime-specific implementations if needed
 */
export class UniversalHttpAdapter extends BaseAdapter {
  /**
   * Check if Fetch API is available
   */
  isSupported(): boolean {
    return typeof fetch !== 'undefined'
  }

  /**
   * Execute HTTP request using Fetch API
   */
  async request(config: AziosRequestConfig): Promise<AziosResponse> {
    if (!this.isSupported()) {
      throw new AziosError(
        'Fetch API is not available in this runtime',
        'UNSUPPORTED_RUNTIME',
        config
      )
    }

    try {
      const { url, method = 'GET', headers, data, timeout, signal } = config

      const baseURL = config.baseURL ? config.baseURL : ''
      const fullURL = new URL(baseURL + url)

      // Add query parameters
      if (config.params) {
        Object.entries(config.params).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            if (Array.isArray(value)) {
              value.forEach(v => fullURL.searchParams.append(key, String(v)))
            } else {
              fullURL.searchParams.set(key, String(value))
            }
          }
        })
      }

      // Prepare request body
      let body: string | null = null
      if (data) {
        body = typeof data === 'string' ? data : JSON.stringify(data)
      }

      // Set up timeout if specified (using AbortController)
      let timeoutId: NodeJS.Timeout | undefined
      const controller = new AbortController()
      const finalSignal = signal || controller.signal

      if (timeout) {
        timeoutId = setTimeout(() => {
          controller.abort()
        }, timeout)
      }

      // Execute fetch
      const response = await fetch(fullURL.toString(), {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body,
        signal: finalSignal as any
      })

      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      // Parse response body
      let responseData: any

      if (response.status === 204) {
        // No content
        responseData = null
      } else {
        const contentType = response.headers.get('content-type')

        if (contentType?.includes('application/json')) {
          try {
            responseData = await response.json()
          } catch {
            responseData = await response.text()
          }
        } else {
          responseData = await response.text()
        }
      }

      const aziosResponse: AziosResponse = {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        config
      }

      return aziosResponse
    } catch (err) {
      if (err instanceof TypeError && err.message.includes('aborted')) {
        throw new AziosError(
          'Request aborted',
          'ABORTED',
          config
        )
      }

      if (err instanceof AziosError) {
        throw err
      }

      throw new AziosError(
        err instanceof Error ? err.message : 'Network request failed',
        'NETWORK_ERROR',
        config,
        undefined,
        err instanceof Error ? err : new Error(String(err))
      )
    }
  }
}

export default UniversalHttpAdapter
