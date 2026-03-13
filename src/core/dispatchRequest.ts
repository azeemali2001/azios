import { AziosRequestConfig } from "../types/config"
import { AziosResponse } from "../types/response"
import buildURL from "../helpers/buildURL"
import AziosError from "../errors/AziosError"
import AdapterFactory from "../runtimes/AdapterFactory"

import { getPending, setPending, removePending } from "./requestStore"
import { getCache, setCache } from "../cache/memoryCache"
import { schedule } from "../rateLimiter/rateLimiter"

/**
 * Sleep utility for retry delays
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Make a single HTTP request using the universal adapter
 * This ensures cross-runtime compatibility
 */
async function makeRequest(config: AziosRequestConfig): Promise<AziosResponse> {
  const adapter = AdapterFactory.getAdapter()
  return adapter.request(config)
}

export default async function dispatchRequest(config: AziosRequestConfig) {

  const requestKey =
    `${config.method}-${config.url}-${JSON.stringify(config.params)}`

  // -------------------------
  // CACHE CHECK (Sprint 4)
  // -------------------------

  if (config.cache) {

    const cached = getCache(requestKey)

    if (cached) {
      return cached
    }

  }

  // -------------------------
  // DEDUPLICATION (Sprint 3)
  // -------------------------

  const existing = getPending(requestKey)

  if (existing) {
    return existing
  }

  const retries = config.retry || 0
  const retryDelay = config.retryDelay || 300

  let attempt = 0

  const promise = (async () => {

    while (true) {

      try {

        const task = () => makeRequest(config)

        const response = config.rateLimit
          ? await schedule(task, config.rateLimit)
          : await task()

        // -------------------------
        // CACHE STORE
        // -------------------------

        if (config.cache) {
          setCache(requestKey, response, config.cacheTTL ?? 5000)
        }

        removePending(requestKey)

        return response

      } catch (err) {

        if (attempt >= retries) {

          removePending(requestKey)

          throw err

        }

        attempt++

        const backoff = retryDelay * Math.pow(2, attempt)

        await delay(backoff)

      }

    }

  })()

  setPending(requestKey, promise)

  return promise

}