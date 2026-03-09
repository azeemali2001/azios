import http from "http"
import https from "https"
import { URL } from "url"

import { AziosRequestConfig } from "../types/config"
import { AziosResponse } from "../types/response"
import buildURL from "../helpers/buildURL"
import AziosError from "../errors/AziosError"

import { getPending, setPending, removePending } from "./requestStore"

import { getCache, setCache } from "../cache/memoryCache"
import { schedule } from "../rateLimiter/rateLimiter"

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function makeRequest(config: AziosRequestConfig): Promise<AziosResponse> {

  return new Promise((resolve, reject) => {

    let url = config.baseURL
      ? config.baseURL + config.url
      : config.url

    url = buildURL(url!, config.params)

    const parsedURL = new URL(url!)

    const isHttps = parsedURL.protocol === "https:"

    const transport = isHttps ? https : http

    const options = {
      hostname: parsedURL.hostname,
      port: parsedURL.port || (isHttps ? 443 : 80),
      path: parsedURL.pathname + parsedURL.search,
      method: config.method || "GET",

      headers: {
        "Content-Type": "application/json",
        ...config.headers
      }
    }

    const req = transport.request(options, res => {

      if (config.signal) {

        config.signal.addEventListener("abort", () => {

          req.destroy()

          reject(
            new AziosError(
              "Request aborted",
              "ABORTED",
              config,
              req
            )
          )

        })

      }

      let rawData = ""

      res.on("data", chunk => {
        rawData += chunk
      })

      res.on("end", () => {

        let responseData: any = rawData

        try {
          responseData = JSON.parse(rawData)
        } catch {}

        const response: AziosResponse = {
          data: responseData,
          status: res.statusCode || 0,
          statusText: res.statusMessage || "",
          headers: res.headers,
          config,
          request: req
        }

        resolve(response)

      })

    })

    req.on("error", err => {

      reject(
        new AziosError(
          err.message,
          "NETWORK_ERROR",
          config,
          req
        )
      )

    })

    if (config.data) {

      const body =
        typeof config.data === "string"
          ? config.data
          : JSON.stringify(config.data)

      req.write(body)

    }

    req.end()

  })

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
          setCache(requestKey, response)
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