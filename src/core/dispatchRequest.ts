import http from "http"
import https from "https"
import { URL } from "url"

import { AziosRequestConfig } from "../types/config"
import { AziosResponse } from "../types/response"
import buildURL from "../helpers/buildURL"

export default function dispatchRequest(config: AziosRequestConfig) {

  return new Promise<AziosResponse>((resolve, reject) => {

    // Build full URL
    let url = config.baseURL
      ? config.baseURL + config.url
      : config.url

    // Add query parameters
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

      let rawData = ""

      res.on("data", chunk => {
        rawData += chunk
      })

      res.on("end", () => {

        let responseData: any = rawData

        // Automatic JSON parsing
        try {
          responseData = JSON.parse(rawData)
        } catch {
          // leave as string if not JSON
        }

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
      reject(err)
    })

    // Send request body
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